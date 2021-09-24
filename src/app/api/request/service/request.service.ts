import { IAlbumDocument } from 'api/album/model'
import { AlbumRepository, IAlbumRepository } from 'api/album/repository'
import { IArtistDocument } from 'api/artist/model'
import { ArtistRepository, IArtistRepository } from 'api/artist/repository'
import { RequestEntityNameEnum, RequestStatusEnum } from 'api/request/interface'
import { IRequestRepository, RequestRepository } from 'api/request/repository'
import { IRequestService } from 'api/request/service'
import { ITrackDocument } from 'api/track/model'
import { ITrackRepository, TrackRepository } from 'api/track/repository'

class RequestService implements IRequestService {
  private readonly requestRepository: IRequestRepository
  private readonly artistRepository: IArtistRepository
  private readonly albumRepository: IAlbumRepository
  private readonly trackRepository: ITrackRepository

  public constructor() {
    this.requestRepository = RequestRepository
    this.artistRepository = ArtistRepository
    this.albumRepository = AlbumRepository
    this.trackRepository = TrackRepository
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
      const request = await this.requestRepository.findOneByIdAndDelete(id)

      if (request.status !== RequestStatusEnum.Approved) {
        const entityName = request.entityName
        const entity = request.entity as
          | IArtistDocument
          | IAlbumDocument
          | ITrackDocument

        if (entityName === RequestEntityNameEnum.Artist) {
          await this.artistRepository.deleteOneById(entity.id)
        }
        if (entityName === RequestEntityNameEnum.Album) {
          await this.albumRepository.deleteOneById(entity.id)
        }
        if (entityName === RequestEntityNameEnum.Track) {
          await this.trackRepository.deleteOneById(entity.id)
        }
      }
    } catch (error) {
      throw error
    }
  }
}

export default new RequestService()
