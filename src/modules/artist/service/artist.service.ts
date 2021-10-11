import isEmpty from 'lodash/isEmpty'

import { ModelNamesEnum } from 'database/constants'
import { DocumentId } from 'database/interface/document'
import { isNotFoundDBError } from 'database/utils/errors'
import { IAlbumDocumentArray } from 'modules/album/interface'
import { AlbumService, IAlbumService } from 'modules/album/service'
import { IArtistDocument } from 'modules/artist/model'
import { ArtistRepository, IArtistRepository } from 'modules/artist/repository'
import { IArtistService } from 'modules/artist/service'
import { IImageService, ImageService } from 'modules/image/service'
import { IRequestService, RequestService } from 'modules/request/service'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import {
  badRequestError,
  isHttpError,
  notFoundError,
  serverError,
} from 'shared/utils/errors/httpErrors'

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
        const entity = request.entity as IArtistDocument
        return entity.id
      })

      const repoFilter = { ids: artistIds }

      return this.artistRepository.findAllWhere(repoFilter)
    } catch (error) {
      throw serverError('Error while getting artists')
    }
  }

  public createOne: IArtistService['createOne'] = async (payload) => {
    let artist: IArtistDocument
    const theServerError = serverError('Error while creating new artist')

    try {
      artist = await this.artistRepository.createOne({
        name: payload.name,
        info: payload.info,
        photo: payload.photo,
      })
    } catch (error) {
      if (isValidationError(error.name)) {
        throw badRequestError(error.message, {
          kind: error.name,
          errors: error.errors,
        })
      }

      throw theServerError
    }

    try {
      await this.requestService.createOne({
        entityName: ModelNamesEnum.Artist,
        entity: artist.id,
        creator: payload.userId,
      })

      return artist
    } catch (error) {
      // log to file (Create request error)
      try {
        // log to file (начало удаления)
        await this.artistRepository.deleteOneById(artist.id)
        // log to file (конец удаления)
        throw theServerError
      } catch (error) {
        if (isHttpError(error)) {
          throw theServerError
        }

        console.error(`Artist by id "${artist.id}" was not deleted`)
        // log not deleted artist to file (Artist by id "${artist.id}" was not deleted)
        throw theServerError
      }
    }
  }

  public deleteOneById: IArtistService['deleteOneById'] = async (id) => {
    let artist: IArtistDocument

    try {
      artist = await this.artistRepository.deleteOneById(id)
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw notFoundError(`Artist with id "${id}" was not found`)
      }

      throw serverError(`Error while deleting artist by id "${id}"`)
    }

    try {
      const artistHasPhoto = !!artist.photo

      if (artistHasPhoto) {
        const photoId = artist.photo as string
        await this.imageService.deleteOneById(photoId)
      }

      const albumsByArtistId = await this.getArtistAlbums(artist.id)
      const artistHasAlbums = !isEmpty(albumsByArtistId)

      if (artistHasAlbums) {
        await this.albumService.deleteMany({ albums: albumsByArtistId })
      }

      await this.requestService.deleteOne({ entityId: artist.id })

      return artist
    } catch (error) {
      throw serverError('Error while deleting related objects of artist')
    }
  }
}

export default new ArtistService()
