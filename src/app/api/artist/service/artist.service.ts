import isEmpty from 'lodash/isEmpty'

import { IAlbumDocumentArray } from 'api/album/interface'
import { IAlbumDocument } from 'api/album/model'
import { AlbumService, IAlbumService } from 'api/album/service'
import { IArtistDocument } from 'api/artist/model'
import { ArtistRepository, IArtistRepository } from 'api/artist/repository'
import { IArtistService } from 'api/artist/service'
import { IImageService, ImageService } from 'api/image/service'
import { IRequestService, RequestService } from 'api/request/service'
import { ITrackDocument } from 'api/track/model'
import { ModelNamesEnum } from 'database/constants'
import { DocumentId } from 'database/interface/document'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { createServerError } from 'shared/utils/errors/httpErrors'
import { BadRequestResponse, ServerErrorResponse } from 'shared/utils/response'

class ArtistService implements IArtistService {
  private readonly artistRepository: IArtistRepository
  private readonly albumService: IAlbumService
  private readonly requestService: IRequestService
  private readonly imageService: IImageService

  private getArtistAlbums = async (
    artistId: DocumentId,
  ): Promise<IAlbumDocumentArray> => {
    return this.albumService.getAll({
      artist: artistId,
    })
  }

  constructor() {
    this.artistRepository = ArtistRepository
    this.albumService = AlbumService
    this.requestService = RequestService
    this.imageService = ImageService
  }

  public getAll: IArtistService['getAll'] = async (filter) => {
    try {
      const requests = await this.requestService.getAll({
        status: filter.status,
        creator: filter.userId,
        kind: ModelNamesEnum.Artist,
      })

      const artistIds = requests.map((request) => {
        const entity = request.entity as
          | IArtistDocument
          | IAlbumDocument
          | ITrackDocument

        return entity.id
      })

      return this.artistRepository.findAllWhere({
        ids: artistIds,
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

      await this.requestService.createOne({
        entityName: ModelNamesEnum.Artist,
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
      const artist = await this.artistRepository.deleteOneById(id)
      const artistHasPhoto = !!artist.photo

      if (artistHasPhoto) {
        const photoId = artist.photo
        await this.imageService.deleteOneById(photoId as string)
      }

      const albumsByArtistId = await this.getArtistAlbums(artist.id)
      const artistHasAlbums = !isEmpty(albumsByArtistId)

      if (artistHasAlbums) {
        await this.albumService.deleteMany({ albums: albumsByArtistId })
      }

      await this.requestService.deleteOne({ entityId: artist.id })

      return artist
    } catch (error) {
      throw createServerError()
    }
  }
}

export default new ArtistService()
