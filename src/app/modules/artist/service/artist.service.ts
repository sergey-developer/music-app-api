import isEmpty from 'lodash/isEmpty'
import { delay, inject, singleton } from 'tsyringe'

import { EntityNamesEnum } from 'database/constants/entityNames'
import { DocumentId } from 'database/interface/document'
import { isNotFoundDBError } from 'database/utils/errors'
import logger from 'lib/logger'
import { IAlbumDocumentArray } from 'modules/album/interface'
import { AlbumService } from 'modules/album/service'
import { IArtistDocument } from 'modules/artist/model'
import { ArtistRepository } from 'modules/artist/repository'
import { IArtistService } from 'modules/artist/service'
import { RequestService } from 'modules/request/service'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import { NotFoundError, ServerError } from 'shared/utils/errors/httpErrors'
import { ValidationError } from 'shared/utils/errors/validationErrors'
import { deleteImageFromFs } from 'shared/utils/file'

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
      throw ServerError('Error while getting artists')
    }
  }

  public getOneById: IArtistService['getOneById'] = async (id) => {
    try {
      const artist = await this.artistRepository.findOneById(id)
      return artist
    } catch (error: any) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError('Artist was not found')
      }

      logger.error(error.stack)
      throw ServerError('Error while getting artist')
    }
  }

  public createOne: IArtistService['createOne'] = async (payload) => {
    let artist: IArtistDocument
    const serverErrorMsg = 'Error while creating new artist'

    try {
      artist = await this.artistRepository.createOne({
        name: payload.name,
        info: payload.info,
        photo: payload.photo,
      })
    } catch (error: any) {
      if (payload.photo) deleteImageFromFs(payload.photo)

      if (isValidationError(error.name)) {
        throw ValidationError(null, error)
      }

      logger.error(error.stack)
      throw ServerError(serverErrorMsg)
    }

    try {
      await this.requestService.createOne({
        entityName: EntityNamesEnum.Artist,
        entity: artist.id,
        creator: payload.userId,
      })

      return artist
    } catch (error: any) {
      logger.error(error.stack, {
        message: `Error while creating request for artist with id: "${artist.id}"`,
      })

      try {
        await this.artistRepository.deleteOneById(artist.id)
        if (artist.photo) deleteImageFromFs(artist.photo)
      } catch (error: any) {
        logger.warn(error.stack, {
          message: `Artist by id "${artist.id}" probably was not deleted`,
        })

        if (artist.photo) deleteImageFromFs(artist.photo)
      }

      throw ServerError(serverErrorMsg)
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
      if (payload.photo) deleteImageFromFs(payload.photo)

      if (isValidationError(error.name)) {
        throw ValidationError(null, error)
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
    const serverErrorMsg = 'Error while deleting artist'

    try {
      artist = await this.artistRepository.deleteOneById(id)
      if (artist.photo) deleteImageFromFs(artist.photo)
    } catch (error: any) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError('Artist was not found')
      }

      logger.error(error.stack)
      throw ServerError(serverErrorMsg)
    }

    try {
      const albumsByArtistId = await this.getArtistAlbums(artist.id)
      const artistHasAlbums = !isEmpty(albumsByArtistId)

      if (artistHasAlbums) {
        await this.albumService.deleteMany({ albums: albumsByArtistId })
      }

      await this.requestService.deleteOne({ entityId: artist.id })

      return artist
    } catch (error: any) {
      logger.error(error.stack, {
        message: 'Error while deleting related objects of artist',
      })

      throw ServerError(serverErrorMsg)
    }
  }
}

export default ArtistService
