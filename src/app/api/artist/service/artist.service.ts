import { IAlbumDocumentArray } from 'api/album/interface'
import { IAlbumDocument } from 'api/album/model'
import { AlbumRepository, IAlbumRepository } from 'api/album/repository'
import { IArtistDocument } from 'api/artist/model'
import { ArtistRepository, IArtistRepository } from 'api/artist/repository'
import { IArtistService } from 'api/artist/service'
import { IImageDocument } from 'api/image/model'
import { IImageRepository, ImageRepository } from 'api/image/repository'
import { RequestEntityNameEnum } from 'api/request/interface'
import { IRequestRepository, RequestRepository } from 'api/request/repository'
import { DocumentId } from 'database/interface/document'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { BadRequestResponse, ServerErrorResponse } from 'shared/utils/response'

class ArtistService implements IArtistService {
  private readonly artistRepository: IArtistRepository
  private readonly albumRepository: IAlbumRepository
  private readonly requestRepository: IRequestRepository
  private readonly imageRepository: IImageRepository

  private getArtistAlbums = async (
    artistId: DocumentId<IArtistDocument>,
  ): Promise<IAlbumDocumentArray> => {
    return this.albumRepository.findAllWhere({
      artist: artistId,
    })
  }

  constructor() {
    this.artistRepository = ArtistRepository
    this.albumRepository = AlbumRepository
    this.requestRepository = RequestRepository
    this.imageRepository = ImageRepository
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
      const imagesIds: Array<DocumentId<IImageDocument>> = []
      const albumsIds: Array<DocumentId<IAlbumDocument>> = []

      const deletedArtist = await this.artistRepository.deleteOneById(id)
      if (deletedArtist.photo) imagesIds.push(deletedArtist.photo)

      const artistAlbums = await this.getArtistAlbums(deletedArtist.id)

      artistAlbums.forEach((album) => {
        if (album.image) imagesIds.push(album.image)
        albumsIds.push(album.id)
      })

      // делать удаление через сервисы
      await this.albumRepository.deleteMany({ ids: albumsIds })
      await this.imageRepository.deleteMany({ ids: imagesIds })

      return deletedArtist
    } catch (error) {
      throw error
    }
  }
}

export default new ArtistService()
