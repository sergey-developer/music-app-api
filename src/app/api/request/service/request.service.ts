import { IAlbumDocument } from 'api/album/model'
import { AlbumService, IAlbumService } from 'api/album/service'
import { IArtistDocument } from 'api/artist/model'
import { ArtistService, IArtistService } from 'api/artist/service'
import { RequestEntityNameEnum, RequestStatusEnum } from 'api/request/interface'
import { IRequestRepository, RequestRepository } from 'api/request/repository'
import { IRequestService } from 'api/request/service'
import { ITrackDocument } from 'api/track/model'
import { ITrackService, TrackService } from 'api/track/service'
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
    return this.requestRepository.createOne({
      entityName: payload.entityName,
      entity: payload.entity,
      creator: payload.creator,
    })
  }

  public deleteOneById: IRequestService['deleteOneById'] = async (id) => {
    try {
      const request = await this.requestRepository.deleteOneById(id)

      if (request.status !== RequestStatusEnum.Approved) {
        const entityName = request.entityName
        const entity = request.entity as
          | IArtistDocument
          | IAlbumDocument
          | ITrackDocument

        if (entityName === RequestEntityNameEnum.Artist) {
          await this.artistService.deleteOneById(entity.id)
        }
        if (entityName === RequestEntityNameEnum.Album) {
          await this.albumService.deleteOneById(entity.id)
        }
        if (entityName === RequestEntityNameEnum.Track) {
          await this.trackService.deleteOneById(entity.id)
        }
      }

      return request
    } catch (error) {
      if (isNotFoundError(error)) {
        throw createNotFoundError(`Request with id "${id}" was not found`)
      }

      throw createServerError(`Error while deleting request by id "${id}"`)
    }
  }
}

export default new RequestService()
