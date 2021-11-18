import isEmpty from 'lodash/isEmpty'
import { delay, inject, singleton } from 'tsyringe'

import DatabaseError from 'database/errors'
import {
  isAlbumModelName,
  isArtistModelName,
  isTrackModelName,
} from 'database/utils/checkEntityName'
import logger from 'lib/logger'
import { IAlbumDocument } from 'modules/album/model'
import { AlbumService } from 'modules/album/service'
import { IArtistDocument } from 'modules/artist/model'
import { ArtistService } from 'modules/artist/service'
import { IRequestDocument } from 'modules/request/model'
import { RequestRepository } from 'modules/request/repository'
import { IRequestService } from 'modules/request/service'
import { isApprovedRequest } from 'modules/request/utils'
import { ITrackDocument } from 'modules/track/model'
import { TrackService } from 'modules/track/service'
import {
  EMPTY_FILTER_ERR_MSG,
  VALIDATION_ERR_MSG,
} from 'shared/constants/errorMessages'
import { omitUndefined } from 'shared/utils/common'
import AppError from 'shared/utils/errors/appErrors'

@singleton()
class RequestService implements IRequestService {
  private deleteViaEntity = async (
    request: IRequestDocument,
  ): Promise<void> => {
    try {
      const entity = request.entity as
        | IArtistDocument
        | IAlbumDocument
        | ITrackDocument

      const entityName = request.entityName
      const entityId = entity.id

      if (isArtistModelName(entityName)) {
        await this.artistService.deleteOneById(entityId)
      }

      if (isAlbumModelName(entityName)) {
        await this.albumService.deleteOneById(entityId)
      }

      if (isTrackModelName(entityName)) {
        await this.trackService.deleteOneById(entityId)
      }
    } catch (error: any) {
      logger.error(error.stack)
      throw new AppError.UnknownError('Error while deleting request')
    }
  }

  public constructor(
    @inject(delay(() => RequestRepository))
    private readonly requestRepository: RequestRepository,

    @inject(delay(() => AlbumService))
    private readonly albumService: AlbumService,

    private readonly artistService: ArtistService,
    private readonly trackService: TrackService,
  ) {}

  public getAll: IRequestService['getAll'] = async (filter) => {
    try {
      return isEmpty(filter)
        ? this.requestRepository.findAll()
        : this.requestRepository.findAllWhere(filter)
    } catch (error: any) {
      logger.error(error.stack)
      throw new AppError.UnknownError('Error while getting requests')
    }
  }

  public createOne: IRequestService['createOne'] = async (payload) => {
    try {
      const request = await this.requestRepository.createOne({
        entityName: payload.entityName,
        entity: payload.entity,
        creator: payload.creator,
      })

      return request
    } catch (error: any) {
      if (error instanceof DatabaseError.ValidationError) {
        throw new AppError.ValidationError(VALIDATION_ERR_MSG, error.errors)
      }

      logger.error(error.stack)
      throw new AppError.UnknownError('Error while creating new request')
    }
  }

  public updateOneById: IRequestService['updateOneById'] = async (
    id,
    payload,
  ) => {
    try {
      const updatedRequest = await this.requestRepository.updateOne(
        { id },
        payload,
      )

      return updatedRequest
    } catch (error: any) {
      if (error instanceof DatabaseError.NotFoundError) {
        throw new AppError.NotFoundError('Request was not found')
      }

      if (error instanceof DatabaseError.ValidationError) {
        throw new AppError.ValidationError(VALIDATION_ERR_MSG, error.errors)
      }

      logger.error(error.stack, {
        message: 'Update request error',
        args: { id, payload },
      })

      throw new AppError.UnknownError('Error while updating request')
    }
  }

  public deleteOneWithEntity: IRequestService['deleteOneWithEntity'] = async (
    requestId,
  ) => {
    let request: IRequestDocument
    const serverErrorMsg = 'Error while deleting request'

    try {
      request = await this.requestRepository.findOne({ id: requestId })
    } catch (error: any) {
      if (error instanceof DatabaseError.NotFoundError) {
        throw new AppError.NotFoundError('Request was not found')
      }

      logger.error(error.stack)
      throw new AppError.UnknownError(serverErrorMsg)
    }

    try {
      if (isApprovedRequest(request.status)) {
        await this.deleteOne({ id: requestId })
      } else {
        await this.deleteViaEntity(request)
      }

      return request
    } catch (error: any) {
      if (error instanceof AppError.NotFoundError) {
        throw error
      }

      logger.error(error.stack)
      throw new AppError.UnknownError(serverErrorMsg)
    }
  }

  public deleteOne: IRequestService['deleteOne'] = async (filter) => {
    try {
      const request = await this.requestRepository.deleteOne(filter)
      return request
    } catch (error: any) {
      if (error instanceof DatabaseError.NotFoundError) {
        throw new AppError.NotFoundError('Request was not found')
      }

      logger.error(error.stack)
      throw new AppError.UnknownError('Error while deleting request')
    }
  }

  public deleteMany: IRequestService['deleteMany'] = async (filter) => {
    const deleteManyFilter = omitUndefined(filter)

    if (isEmpty(deleteManyFilter)) {
      throw new AppError.EmptyFilterError(EMPTY_FILTER_ERR_MSG)
    }

    try {
      await this.requestRepository.deleteMany(deleteManyFilter)
    } catch (error: any) {
      logger.error(error.stack)
      throw new AppError.UnknownError('Error while deleting requests')
    }
  }
}

export default RequestService
