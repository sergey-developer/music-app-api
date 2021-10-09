import isEmpty from 'lodash/isEmpty'

import { IAlbumDocument } from 'api/album/model'
import { AlbumService, IAlbumService } from 'api/album/service'
import { IArtistDocument } from 'api/artist/model'
import { ArtistService, IArtistService } from 'api/artist/service'
import { IRequestDocument } from 'api/request/model'
import { IRequestRepository, RequestRepository } from 'api/request/repository'
import { IRequestService } from 'api/request/service'
import { isApprovedRequest } from 'api/request/utils'
import { ITrackDocument } from 'api/track/model'
import { ITrackService, TrackService } from 'api/track/service'
import {
  isAlbumModelName,
  isArtistModelName,
  isTrackModelName,
} from 'database/utils/checkModelName'
import { isEmptyFilterError } from 'shared/utils/errors/checkErrorKind'
import {
  badRequestError,
  isBadRequestError,
  isNotFoundError,
  notFoundError,
  serverError,
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
      throw serverError()
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
      throw serverError('Error while getting requests')
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
      throw serverError('Error while creating new request')
    }
  }

  public deleteOneWithEntity: IRequestService['deleteOneWithEntity'] = async (
    requestId,
  ) => {
    let request: IRequestDocument

    try {
      request = await this.requestRepository.findOneById(requestId)
    } catch (error) {
      if (isNotFoundError(error)) {
        throw notFoundError(`Request with id "${requestId}" was not found`)
      }

      throw serverError(`Error while deleting request by id "${requestId}"`)
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
        throw notFoundError(`Request with id "${requestId}" was not found`)
      }

      throw serverError(`Error while deleting request by id "${requestId}"`)
    }
  }

  public deleteOne: IRequestService['deleteOne'] = async (filter) => {
    try {
      const request = await this.requestRepository.deleteOne(filter)
      return request
    } catch (error) {
      if (isNotFoundError(error)) {
        throw notFoundError('Request was not found')
      }

      throw serverError('Error while deleting request')
    }
  }

  public deleteMany: IRequestService['deleteMany'] = async (filter) => {
    try {
      await this.requestRepository.deleteMany(filter)
    } catch (error) {
      if (isBadRequestError(error)) {
        if (isEmptyFilterError(error.kind)) {
          throw badRequestError(
            'Deleting many requests with empty filter forbidden',
          )
        }
      }

      throw serverError('Error while deleting many requests')
    }
  }
}

export default new RequestService()
