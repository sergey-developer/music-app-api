import { AlbumRepository, IAlbumRepository } from 'api/album/repository'
import { IAlbumService } from 'api/album/service'
import { RequestEntityNameEnum } from 'api/request/interface'
import { IRequestRepository, RequestRepository } from 'api/request/repository'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { BadRequestResponse, ServerErrorResponse } from 'shared/utils/response'

class AlbumService implements IAlbumService {
  private readonly albumRepository: IAlbumRepository
  private readonly requestRepository: IRequestRepository

  public constructor() {
    this.albumRepository = AlbumRepository
    this.requestRepository = RequestRepository
  }

  public getAll: IAlbumService['getAll'] = async (filter) => {
    try {
      return this.albumRepository.findAllWhere(filter)
    } catch (error) {
      throw error
    }
  }

  public createOne: IAlbumService['createOne'] = async (payload) => {
    try {
      const album = await this.albumRepository.createOne({
        name: payload.name,
        image: payload.image,
        releaseDate: payload.releaseDate,
        artist: payload.artist,
      })

      await this.requestRepository.createOne({
        entityName: RequestEntityNameEnum.Album,
        entity: album.id,
        creator: payload.userId,
      })

      return album
    } catch (error) {
      // TODO: при ошибки создания request удалять созданный альбом
      // TODO: response создавать в контроллере, здесь просто выбрасывать нужную ошибку
      if (error.name === ErrorKindsEnum.ValidationError) {
        throw new BadRequestResponse(error.name, error.message, {
          errors: error.errors,
        })
      }

      throw new ServerErrorResponse(
        ErrorKindsEnum.UnknownServerError,
        'Error was occurred while creating Album',
      )
    }
  }

  public getOneById: IAlbumService['getOneById'] = async (id) => {
    try {
      return this.albumRepository.findOneById(id)
    } catch (error) {
      throw error
    }
  }
}

export default new AlbumService()
