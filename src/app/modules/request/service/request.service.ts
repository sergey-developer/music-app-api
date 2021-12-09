import isEmpty from 'lodash/isEmpty'
import { delay, inject, singleton } from 'tsyringe'

import {
  EMPTY_FILTER_ERR_MSG,
  VALIDATION_ERR_MSG,
} from 'app/constants/messages/errors'
import { omitUndefined } from 'app/utils/common'
import {
  AppNotFoundError,
  AppUnknownError,
  AppValidationError,
  isAppNotFoundError,
} from 'app/utils/errors/appErrors'
import {
  isDatabaseNotFoundError,
  isDatabaseValidationError,
} from 'database/errors'
import { IAlbumDocument } from 'database/models/album'
import { IArtistDocument } from 'database/models/artist'
import { IRequestDocument } from 'database/models/request'
import { ITrackDocument } from 'database/models/track'
import {
  isAlbumModelName,
  isArtistModelName,
  isTrackModelName,
} from 'database/utils/checkEntityName'
import logger from 'lib/logger'
import { AlbumService } from 'modules/album/service'
import { ArtistService } from 'modules/artist/service'
import { RequestRepository } from 'modules/request/repository'
import { IRequestService } from 'modules/request/service'
import { isApprovedRequest } from 'modules/request/utils'
import { TrackService } from 'modules/track/service'

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
      throw new AppUnknownError('Error while deleting request')
    }
  }

  public constructor(
    @inject(delay(() => RequestRepository))
    private readonly requestRepository: RequestRepository,

    @inject(delay(() => AlbumService))
    private readonly albumService: AlbumService,

    @inject(delay(() => ArtistService))
    private readonly artistService: ArtistService,

    @inject(delay(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  public getAll: IRequestService['getAll'] = async (filter) => {
    try {
      const requests = isEmpty(filter)
        ? await this.requestRepository.findAll()
        : await this.requestRepository.findAllWhere(filter)

      return requests
    } catch (error: any) {
      logger.error(error.stack)
      throw new AppUnknownError('Error while getting requests')
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
      if (isDatabaseValidationError(error)) {
        throw new AppValidationError(VALIDATION_ERR_MSG, error.errors)
      }

      logger.error(error.stack)
      throw new AppUnknownError('Error while creating new request')
    }
  }

  public updateOne: IRequestService['updateOne'] = async (filter, payload) => {
    try {
      const updatedRequest = await this.requestRepository.updateOne(
        filter,
        payload,
      )

      return updatedRequest
    } catch (error: any) {
      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError('Request was not found')
      }

      if (isDatabaseValidationError(error)) {
        throw new AppValidationError(VALIDATION_ERR_MSG, error.errors)
      }

      logger.error(error.stack, {
        message: 'Update request error',
        args: { filter, payload },
      })

      throw new AppUnknownError('Error while updating request')
    }
  }

  public deleteOneWithEntity: IRequestService['deleteOneWithEntity'] = async (
    requestId,
  ) => {
    let request: IRequestDocument
    const unknownErrorMsg = 'Error while deleting request'

    try {
      request = await this.requestRepository.findOne({ id: requestId })
    } catch (error: any) {
      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError('Request was not found')
      }

      logger.error(error.stack)
      throw new AppUnknownError(unknownErrorMsg)
    }

    try {
      if (isApprovedRequest(request.status)) {
        await this.deleteOne({ id: requestId })
      } else {
        await this.deleteViaEntity(request)
      }

      return request
    } catch (error: any) {
      if (isAppNotFoundError(error)) {
        throw error
      }

      logger.error(error.stack)
      throw new AppUnknownError(unknownErrorMsg)
    }
  }

  public deleteOne: IRequestService['deleteOne'] = async (filter) => {
    try {
      const request = await this.requestRepository.deleteOne(filter)
      return request
    } catch (error: any) {
      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError('Request was not found')
      }

      logger.error(error.stack)
      throw new AppUnknownError('Error while deleting request')
    }
  }

  public deleteMany: IRequestService['deleteMany'] = async (filter) => {
    const deleteManyFilter = omitUndefined(filter)

    if (isEmpty(deleteManyFilter)) {
      throw new AppValidationError(EMPTY_FILTER_ERR_MSG)
    }

    try {
      const result = await this.requestRepository.deleteMany(deleteManyFilter)
      return result
    } catch (error: any) {
      logger.error(error.stack)
      throw new AppUnknownError('Error while deleting requests')
    }
  }
}

export default RequestService
