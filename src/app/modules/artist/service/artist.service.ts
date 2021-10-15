import isEmpty from 'lodash/isEmpty'

import { ModelNamesEnum } from 'database/constants'
import { DocumentId } from 'database/interface/document'
import { isNotFoundDBError } from 'database/utils/errors'
import logger from 'lib/logger'
import { IAlbumDocumentArray } from 'modules/album/interface'
import { AlbumService, IAlbumService } from 'modules/album/service'
import { IArtistDocument } from 'modules/artist/model'
import { ArtistRepository, IArtistRepository } from 'modules/artist/repository'
import { IArtistService } from 'modules/artist/service'
import { IImageService, ImageService } from 'modules/image/service'
import { IRequestService, RequestService } from 'modules/request/service'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
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
      logger.error(error.stack)
      throw ServerError('Error while getting artists')
    }
  }

  public getOneById: IArtistService['getOneById'] = async (id) => {
    try {
      const artist = await this.artistRepository.findOneById(id)
      return artist
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError('Artist was not found')
      }

      logger.error(error.stack)
      throw ServerError('Error while getting artist')
    }
  }

  public create: IArtistService['create'] = async (payload) => {
    let artist: IArtistDocument
    const serverError = ServerError('Error while creating new artist')

    try {
      artist = await this.artistRepository.create({
        name: payload.name,
        info: payload.info,
        photo: payload.photo,
      })
    } catch (error) {
      if (isValidationError(error.name)) {
        throw BadRequestError(error.message, {
          kind: error.name,
          errors: error.errors,
        })
      }

      logger.error(error.stack)
      throw serverError
    }

    try {
      await this.requestService.create({
        entityName: ModelNamesEnum.Artist,
        entity: artist.id,
        creator: payload.userId,
      })

      return artist
    } catch (error) {
      logger.error(error.stack, {
        message: `Error while creating request for artist with id: "${artist.id}"`,
      })

      try {
        await this.artistRepository.deleteOneById(artist.id)
      } catch (error) {
        logger.warn(error.stack, {
          message: `Artist by id "${artist.id}" was not deleted`,
        })
      }

      throw serverError
    }
  }

  public updateById: IArtistService['updateById'] = async (id, payload) => {
    try {
      await this.artistRepository.update({ id }, payload)
    } catch (error) {
      if (isValidationError(error.name)) {
        throw BadRequestError(error.message, {
          kind: error.name,
          errors: error.errors,
        })
      }

      if (isNotFoundDBError(error)) {
        throw NotFoundError('Artist was not found')
      }

      logger.error(error.stack, {
        message: 'Update artist error',
        args: { id, payload },
      })

      throw ServerError('Error while updating artist')
    }
  }

  public deleteOneById: IArtistService['deleteOneById'] = async (id) => {
    let artist: IArtistDocument

    try {
      artist = await this.artistRepository.deleteOneById(id)
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError(`Artist with id "${id}" was not found`)
      }

      logger.error(error.stack)
      throw ServerError(`Error while deleting artist by id "${id}"`)
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
      logger.error(error.stack)
      throw ServerError('Error while deleting related objects of artist')
    }
  }
}

export default new ArtistService()
