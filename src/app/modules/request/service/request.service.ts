import isEmpty from 'lodash/isEmpty'

import {
  isAlbumModelName,
  isArtistModelName,
  isTrackModelName,
} from 'database/utils/checkModelName'
import { isNotFoundDBError } from 'database/utils/errors'
import logger from 'lib/logger'
import { IAlbumDocument } from 'modules/album/model'
import { AlbumService, IAlbumService } from 'modules/album/service'
import { IArtistDocument } from 'modules/artist/model'
import { ArtistService, IArtistService } from 'modules/artist/service'
import { IRequestDocument } from 'modules/request/model'
import {
  IRequestRepository,
  RequestRepository,
} from 'modules/request/repository'
import { IRequestService } from 'modules/request/service'
import { isApprovedRequest } from 'modules/request/utils'
import { ITrackDocument } from 'modules/track/model'
import { ITrackService, TrackService } from 'modules/track/service'
import { isEmptyFilterError } from 'shared/utils/errors/checkErrorKind'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
  isBadRequestError,
  isNotFoundError,
} from 'shared/utils/errors/httpErrors'

class RequestService implements IRequestService {
  private readonly requestRepository: IRequestRepository
  private readonly artistService: IArtistService
  private readonly albumService: IAlbumService
  private readonly trackService: ITrackService

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

  public constructor() {
    this.requestRepository = RequestRepository
    this.artistService = ArtistService
    this.albumService = AlbumService
    this.trackService = TrackService
  }

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

  public create: IRequestService['create'] = async (payload) => {
    try {
      return this.requestRepository.create({
        entityName: payload.entityName,
        entity: payload.entity,
        creator: payload.creator,
      })
    } catch (error) {
      logger.error(error.stack)
      throw ServerError('Error while creating new request')
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

  public deleteMany: IRequestService['deleteMany'] = async (filter) => {
    try {
      await this.requestRepository.deleteMany(filter)
    } catch (error) {
      if (isBadRequestError(error) && isEmptyFilterError(error.kind)) {
        throw BadRequestError('Deleting requests with empty filter forbidden')
      }

      logger.error(error.stack)
      throw ServerError('Error while deleting requests')
    }
  }
}

export default new RequestService()
