import { ArtistRepository, IArtistRepository } from 'api/artist/repository'
import { IArtistService } from 'api/artist/service'
import { RequestEntityNameEnum } from 'api/request/interface'
import { IRequestRepository, RequestRepository } from 'api/request/repository'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { BadRequestResponse, ServerErrorResponse } from 'shared/utils/response'

class ArtistService implements IArtistService {
  private readonly artistRepository: IArtistRepository
  private readonly requestRepository: IRequestRepository

  constructor() {
    this.artistRepository = ArtistRepository
    this.requestRepository = RequestRepository
  }

  public getAll: IArtistService['getAll'] = async (filter) => {
    try {
      // TODO: создать запрос в схеме и исп-ть его здесь
      const requests = await this.requestRepository.findAllWhere({
        status: filter.status,
        creator: filter.userId,
        kind: RequestEntityNameEnum.Artist,
      })
      const artistsIds = requests.map((req) => req.entity)

      return this.artistRepository.findAllWhere({
        ids: artistsIds,
      })
    } catch (error) {
      throw error
    }
  }

  public createOne: IArtistService['createOne'] = async (payload) => {
    try {
      const artist = await this.artistRepository.createOne({
        name: payload.name,
        info: payload.info,
        photo: payload.photo,
      })

      await this.requestRepository.createOne({
        entityName: RequestEntityNameEnum.Artist,
        entity: artist.id,
        creator: payload.userId,
      })

      return artist
    } catch (error: any) {
      // TODO: при ошибки создания request удалять созданного артиста
      // TODO: response создавать в контроллере, здесь просто выбрасывать нужную ошибку
      if (error.name === ErrorKindsEnum.ValidationError) {
        throw new BadRequestResponse(error.name, error.message, {
          errors: error.errors,
        })
      }

      throw new ServerErrorResponse(
        ErrorKindsEnum.UnknownServerError,
        'Error was occurred while creating Artist',
      )
    }
  }

  public deleteOneById: IArtistService['deleteOneById'] = async (id) => {
    try {
      await this.artistRepository.deleteOneById(id)
    } catch (error) {
      throw error
    }
  }
}

export default new ArtistService()
