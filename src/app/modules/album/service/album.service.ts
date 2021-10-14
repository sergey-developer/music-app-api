import isEmpty from 'lodash/isEmpty'

import { ModelNamesEnum } from 'database/constants'
import { DocumentIdArray } from 'database/interface/document'
import { isNotFoundDBError } from 'database/utils/errors'
import logger from 'lib/logger'
import { IAlbumDocument } from 'modules/album/model'
import { AlbumRepository, IAlbumRepository } from 'modules/album/repository'
import { IAlbumService } from 'modules/album/service'
import { IImageService, ImageService } from 'modules/image/service'
import { IRequestService, RequestService } from 'modules/request/service'
import { ITrackDocumentArray } from 'modules/track/interface'
import { ITrackService, TrackService } from 'modules/track/service'
import {
  isEmptyFilterError,
  isValidationError,
} from 'shared/utils/errors/checkErrorKind'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
  isBadRequestError,
} from 'shared/utils/errors/httpErrors'

class AlbumService implements IAlbumService {
  private readonly albumRepository: IAlbumRepository
  private readonly requestService: IRequestService
  private readonly imageService: IImageService
  private readonly trackService: ITrackService

  private getTracksByAlbumsIds = async (
    albumIds: DocumentIdArray,
  ): Promise<ITrackDocumentArray> => {
    try {
      const tracks = await this.trackService.getAll({ albumIds })
      return tracks
    } catch (error) {
      logger.error(error.stack)
      throw error
    }
  }

  public constructor() {
    this.albumRepository = AlbumRepository
    this.requestService = RequestService
    this.imageService = ImageService
    this.trackService = TrackService
  }

  public getAll: IAlbumService['getAll'] = async (filter) => {
    try {
      const { status, userId, artist } = filter

      const requests = await this.requestService.getAll({
        status,
        creator: userId,
        kind: ModelNamesEnum.Album,
      })

      const albumIds = requests.map((request) => {
        const entity = request.entity as IAlbumDocument
        return entity.id
      })

      const repoFilter = { artist, ids: albumIds }

      return this.albumRepository.findAllWhere(repoFilter)
    } catch (error) {
      logger.error(error.stack)
      throw ServerError('Error while getting albums')
    }
  }

  public createOne: IAlbumService['createOne'] = async (payload) => {
    let album: IAlbumDocument
    const serverError = ServerError('Error while creating new album')

    try {
      album = await this.albumRepository.createOne({
        name: payload.name,
        image: payload.image,
        releaseDate: payload.releaseDate,
        artist: payload.artist,
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
      await this.requestService.createOne({
        entityName: ModelNamesEnum.Album,
        entity: album.id,
        creator: payload.userId,
      })

      return album
    } catch (error) {
      logger.error(error.stack, {
        message: `Error while creating request for album with id: "${album.id}"`,
      })

      try {
        await this.albumRepository.deleteOneById(album.id)
      } catch (error) {
        logger.warn(error.stack, {
          message: `Album by id "${album.id}" was not deleted`,
        })
      }

      throw serverError
    }
  }

  public getOneById: IAlbumService['getOneById'] = async (id) => {
    try {
      const album = await this.albumRepository.findOneById(id)
      return album
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError(`Album with id "${id}" was not found`)
      }

      logger.error(error.stack)
      throw ServerError(`Error while getting album by id "${id}"`)
    }
  }

  public deleteOneById: IAlbumService['deleteOneById'] = async (id) => {
    let album: IAlbumDocument

    try {
      album = await this.albumRepository.deleteOneById(id)
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError(`Album with id "${id}" was not found`)
      }

      logger.error(error.stack)
      throw ServerError(`Error while deleting album by id "${id}"`)
    }

    try {
      const albumHasImage = !!album.image

      if (albumHasImage) {
        const imageId = album.image as string
        await this.imageService.deleteOneById(imageId)
      }

      const tracksByAlbumId = await this.getTracksByAlbumsIds([album.id])
      const albumHasTracks = !isEmpty(tracksByAlbumId)

      if (albumHasTracks) {
        await this.trackService.deleteMany({ tracks: tracksByAlbumId })
      }

      await this.requestService.deleteOne({ entityId: album.id })

      return album
    } catch (error) {
      logger.error(error.stack)
      throw ServerError('Error while deleting related objects of album')
    }
  }

  public deleteMany: IAlbumService['deleteMany'] = async ({ albums }) => {
    const albumsToDelete = albums || []

    const albumIds: DocumentIdArray = []
    const imageIds: DocumentIdArray = []

    albumsToDelete.forEach((album) => {
      albumIds.push(album.id)
      if (album.image) imageIds.push(album.image as string)
    })

    try {
      await this.albumRepository.deleteMany({ ids: albumIds })
    } catch (error) {
      if (isBadRequestError(error) && isEmptyFilterError(error.kind)) {
        throw BadRequestError('Deleting albums with empty filter forbidden')
      }

      logger.error(error.stack)
      throw ServerError('Error while deleting albums')
    }

    try {
      if (!isEmpty(imageIds)) {
        await this.imageService.deleteMany({ ids: imageIds })
      }

      const tracksByAlbumsIds = await this.getTracksByAlbumsIds(albumIds)
      const albumsHaveTracks = !isEmpty(tracksByAlbumsIds)

      if (albumsHaveTracks) {
        await this.trackService.deleteMany({ tracks: tracksByAlbumsIds })
      }

      await this.requestService.deleteMany({ entityIds: albumIds })
    } catch (error) {
      logger.error(error.stack)
      throw ServerError('Error while deleting related objects of albums')
    }
  }
}

export default new AlbumService()
