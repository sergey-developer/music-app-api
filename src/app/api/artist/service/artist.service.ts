import { IAlbumDocumentArray } from 'api/album/interface'
import { IAlbumDocument } from 'api/album/model'
import { AlbumService, IAlbumService } from 'api/album/service'
import { IArtistDocument } from 'api/artist/model'
import { ArtistRepository, IArtistRepository } from 'api/artist/repository'
import { IArtistService } from 'api/artist/service'
import { IImageDocument } from 'api/image/model'
import { IImageService, ImageService } from 'api/image/service'
import { RequestEntityNameEnum } from 'api/request/interface'
import { IRequestRepository, RequestRepository } from 'api/request/repository'
import { DocumentId } from 'database/interface/document'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { createServerError } from 'shared/utils/errors/httpErrors'
import { BadRequestResponse, ServerErrorResponse } from 'shared/utils/response'

class ArtistService implements IArtistService {
  private readonly artistRepository: IArtistRepository
  private readonly albumService: IAlbumService
  private readonly requestRepository: IRequestRepository
  private readonly imageService: IImageService

  private getArtistAlbums = async (
    artistId: DocumentId<IArtistDocument>,
  ): Promise<IAlbumDocumentArray> => {
    return this.albumService.getAll({
      artist: artistId,
    })
  }

  constructor() {
    this.artistRepository = ArtistRepository
    this.albumService = AlbumService
    this.requestRepository = RequestRepository
    this.imageService = ImageService
  }

  public getAll: IArtistService['getAll'] = async (filter) => {
    try {
      // TODO: получать через сервис
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

      await this.albumService.deleteMany({ ids: albumsIds })
      await this.imageService.deleteMany({ ids: imagesIds })

      return deletedArtist
    } catch (error) {
      throw createServerError()
    }
  }
}

export default new ArtistService()
