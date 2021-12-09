import isEmpty from 'lodash/isEmpty'
import { delay, inject, singleton } from 'tsyringe'

import { VALIDATION_ERR_MSG } from 'app/constants/messages/errors'
import {
  AppNotFoundError,
  AppUnknownError,
  AppValidationError,
} from 'app/utils/errors/appErrors'
import { EntityNamesEnum } from 'database/constants'
import {
  isDatabaseNotFoundError,
  isDatabaseValidationError,
} from 'database/errors'
import { DocumentId } from 'database/interface/document'
import { IAlbumDocumentArray } from 'database/models/album'
import { IArtistDocument } from 'database/models/artist'
import logger from 'lib/logger'
import { AlbumService } from 'modules/album/service'
import { ArtistRepository } from 'modules/artist/repository'
import { IArtistService } from 'modules/artist/service'
import { ImageService } from 'modules/image/service'
import { RequestService } from 'modules/request/service'

@singleton()
class ArtistService implements IArtistService {
  private getArtistAlbums = async (
    artistId: DocumentId,
  ): Promise<IAlbumDocumentArray> => {
    return this.albumService.getAll({
      artist: artistId,
    })
  }

  constructor(
    @inject(delay(() => ArtistRepository))
    private readonly artistRepository: ArtistRepository,

    @inject(delay(() => AlbumService))
    private readonly albumService: AlbumService,

    @inject(delay(() => RequestService))
    private readonly requestService: RequestService,

    private readonly imageService: ImageService,
  ) {}

  public getAll: IArtistService['getAll'] = async (filter) => {
    try {
      const requests = await this.requestService.getAll({
        status: filter.status,
        creator: filter.userId,
        kind: EntityNamesEnum.Artist,
      })

      const artistIds = requests.map((request) => {
        const entity = request.entity as IArtistDocument
        return entity.id
      })

      const repoFilter = { ids: artistIds }

      return this.artistRepository.findAllWhere(repoFilter)
    } catch (error: any) {
      logger.error(error.stack)
      throw new AppUnknownError('Error while getting artists')
    }
  }

  public getOneById: IArtistService['getOneById'] = async (id) => {
    try {
      const artist = await this.artistRepository.findOne({ id })
      return artist
    } catch (error: any) {
      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError('Artist was not found')
      }

      logger.error(error.stack)
      throw new AppUnknownError('Error while getting artist')
    }
  }

  public createOne: IArtistService['createOne'] = async (payload) => {
    let artist: IArtistDocument
    const unknownErrorMsg = 'Error while creating new artist'

    try {
      artist = await this.artistRepository.createOne({
        name: payload.name,
        info: payload.info,
        photo: payload.photo,
      })
    } catch (error: any) {
      if (payload.photo) {
        this.imageService.deleteOneByName(payload.photo)
      }

      if (isDatabaseValidationError(error)) {
        throw new AppValidationError(VALIDATION_ERR_MSG, error.errors)
      }

      logger.error(error.stack)
      throw new AppUnknownError(unknownErrorMsg)
    }

    try {
      await this.requestService.createOne({
        entityName: EntityNamesEnum.Artist,
        entity: artist.id,
        creator: payload.user,
      })

      return artist
    } catch (error: any) {
      logger.error(error.stack, {
        message: `Error while creating request for artist with id: "${artist.id}"`,
      })

      try {
        await this.artistRepository.deleteOne({ id: artist.id })

        if (artist.photo) {
          this.imageService.deleteOneByName(artist.photo)
        }
      } catch (error: any) {
        logger.warn(error.stack, {
          message: `Artist by id "${artist.id}" probably was not deleted`,
        })

        if (artist.photo) {
          this.imageService.deleteOneByName(artist.photo)
        }
      }

      throw new AppUnknownError(unknownErrorMsg)
    }
  }

  public updateOneById: IArtistService['updateOneById'] = async (
    id,
    payload,
  ) => {
    try {
      const updatedArtist = await this.artistRepository.updateOne(
        { id },
        payload,
      )

      return updatedArtist
    } catch (error: any) {
      if (payload.photo) {
        this.imageService.deleteOneByName(payload.photo)
      }

      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError('Artist was not found')
      }

      if (isDatabaseValidationError(error)) {
        throw new AppValidationError(VALIDATION_ERR_MSG, error.errors)
      }

      logger.error(error.stack, {
        message: 'Update artist error',
        args: { id, payload },
      })

      throw new AppUnknownError('Error while updating artist')
    }
  }

  public deleteOneById: IArtistService['deleteOneById'] = async (id) => {
    let artist: IArtistDocument
    const unknownErrorMsg = 'Error while deleting artist'

    try {
      artist = await this.artistRepository.deleteOne({ id })

      if (artist.photo) {
        this.imageService.deleteOneByName(artist.photo)
      }
    } catch (error: any) {
      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError('Artist was not found')
      }

      logger.error(error.stack)
      throw new AppUnknownError(unknownErrorMsg)
    }

    try {
      const albumsByArtistId = await this.getArtistAlbums(artist.id)
      const artistHasAlbums = !isEmpty(albumsByArtistId)

      if (artistHasAlbums) {
        await this.albumService.deleteMany({ albums: albumsByArtistId })
      }

      await this.requestService.deleteOne({ entity: artist.id })

      return artist
    } catch (error: any) {
      logger.error(error.stack, {
        message: 'Error while deleting related objects of artist',
      })

      throw new AppUnknownError(unknownErrorMsg)
    }
  }
}

export default ArtistService
