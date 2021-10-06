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
import {
  createNotFoundError,
  createServerError,
  isNotFoundError,
} from 'shared/utils/errors/httpErrors'

class RequestService implements IRequestService {
  private readonly requestRepository: IRequestRepository
  private readonly artistService: IArtistService
  private readonly albumService: IAlbumService
  private readonly trackService: ITrackService

  private deleteWithEntity = async (
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
      throw createServerError()
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
      return this.requestRepository.findAllWhere(filter)
    } catch (error) {
      throw error
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
      throw error
      // TODO: handle error
    }
  }

  public deleteOneWithEntity: IRequestService['deleteOneWithEntity'] = async (
    requestId,
  ) => {
    try {
      const request = await this.requestRepository.findOneById(requestId)

      if (isApprovedRequest(request.status)) {
        await this.deleteOne({ id: requestId })
      } else {
        await this.deleteWithEntity(request)
      }

      return request
    } catch (error) {
      if (isNotFoundError(error)) {
        throw createNotFoundError(
          `Request with id "${requestId}" was not found`,
        )
      }

      throw createServerError(
        `Error while deleting request by id "${requestId}"`,
      )
    }
  }

  public deleteOne: IRequestService['deleteOne'] = async (filter) => {
    try {
      const request = await this.requestRepository.deleteOne(filter)
      return request
    } catch (error) {
      if (isNotFoundError(error)) {
        throw createNotFoundError('Request was not found')
      }

      throw createServerError('Error while deleting request')
    }
  }

  public deleteMany: IRequestService['deleteMany'] = async (filter) => {
    try {
      await this.requestRepository.deleteMany(filter)
    } catch (error) {
      throw createServerError()
    }
  }
}

export default new RequestService()
