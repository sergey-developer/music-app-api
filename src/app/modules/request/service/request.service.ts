import isEmpty from 'lodash/isEmpty'
import { delay, inject, singleton } from 'tsyringe'

import {
  isAlbumModelName,
  isArtistModelName,
  isTrackModelName,
} from 'database/utils/checkEntityName'
import { isNotFoundDBError } from 'database/utils/errors'
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
import { EMPTY_FILTER_ERR_MSG } from 'shared/constants/errorMessages'
import { omitUndefined } from 'shared/utils/common'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
  isNotFoundError,
} from 'shared/utils/errors/httpErrors'

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
    } catch (error) {
      logger.error(error.stack)
      throw ServerError()
    }
  }

  public constructor(
    @inject(delay(() => RequestRepository))
    private readonly requestRepository: RequestRepository,

    private readonly artistService: ArtistService,

    @inject(delay(() => AlbumService))
    private readonly albumService: AlbumService,

    private readonly trackService: TrackService,
  ) {}

  public getAll: IRequestService['getAll'] = async (filter) => {
    try {
      return isEmpty(filter)
        ? this.requestRepository.findAll()
        : this.requestRepository.findAllWhere(filter)
    } catch (error) {
      logger.error(error.stack)
      throw ServerError('Error while getting requests')
    }
  }

  public createOne: IRequestService['createOne'] = async (payload) => {
    try {
      return this.requestRepository.createOne({
        entityName: payload.entityName,
        entity: payload.entity,
        creator: payload.creator,
      })
    } catch (error) {
      logger.error(error.stack)
      throw ServerError('Error while creating new request')
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
    } catch (error) {
      if (isValidationError(error.name)) {
        throw BadRequestError(error.message, {
          kind: error.name,
          errors: error.errors,
        })
      }

      if (isNotFoundDBError(error)) {
        throw NotFoundError('Request was not found')
      }

      logger.error(error.stack, {
        message: 'Update request error',
        args: { id, payload },
      })

      throw ServerError('Error while updating request')
    }
  }

  public deleteOneWithEntity: IRequestService['deleteOneWithEntity'] = async (
    requestId,
  ) => {
    let request: IRequestDocument
    const serverErrorMsg = 'Error while deleting request'

    try {
      request = await this.requestRepository.findOneById(requestId)
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError(`Request with id "${requestId}" was not found`)
      }

      logger.error(error.stack)
      throw ServerError(serverErrorMsg)
    }

    try {
      if (isApprovedRequest(request.status)) {
        await this.deleteOne({ id: requestId })
      } else {
        await this.deleteViaEntity(request)
      }

      return request
    } catch (error) {
      if (isNotFoundError(error)) {
        throw NotFoundError(`Request with id "${requestId}" was not found`)
      }

      logger.error(error.stack)
      throw ServerError(serverErrorMsg)
    }
  }

  public deleteOne: IRequestService['deleteOne'] = async (filter) => {
    try {
      const request = await this.requestRepository.deleteOne(filter)
      return request
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError('Request was not found')
      }

      logger.error(error.stack)
      throw ServerError('Error while deleting request')
    }
  }

  public deleteMany: IRequestService['deleteMany'] = async (rawFilter) => {
    const filter: typeof rawFilter = omitUndefined(rawFilter)

    if (isEmpty(filter)) {
      throw BadRequestError(EMPTY_FILTER_ERR_MSG)
    }

    try {
      await this.requestRepository.deleteMany(filter)
    } catch (error) {
      logger.error(error.stack)
      throw ServerError('Error while deleting requests')
    }
  }
}

export default RequestService
