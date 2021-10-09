import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import { IAlbumDocument } from 'api/album/model'
import { AlbumRepository, IAlbumRepository } from 'api/album/repository'
import { IAlbumService } from 'api/album/service'
import { IImageService, ImageService } from 'api/image/service'
import { IRequestService, RequestService } from 'api/request/service'
import { ITrackDocumentArray } from 'api/track/interface'
import { ITrackService, TrackService } from 'api/track/service'
import { ModelNamesEnum } from 'database/constants'
import { DocumentId, DocumentIdArray } from 'database/interface/document'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import {
  isEmptyFilterError,
  isValidationError,
} from 'shared/utils/errors/checkErrorKind'
import {
  createBadRequestError,
  createNotFoundError,
  createServerError,
  isBadRequestError,
  isHttpError,
  isNotFoundError,
} from 'shared/utils/errors/httpErrors'

class AlbumService implements IAlbumService {
  private readonly albumRepository: IAlbumRepository
  private readonly requestService: IRequestService
  private readonly imageService: IImageService
  private readonly trackService: ITrackService

  private getTracksByAlbumsIds = async (
    albumIds: DocumentIdArray,
  ): Promise<ITrackDocumentArray> => {
    return this.trackService.getAll({ albumIds })
  }

  private getTracksByAlbumId = async (
    albumId: DocumentId,
  ): Promise<ITrackDocumentArray> => {
    return this.trackService.getAll({ album: albumId })
  }

  public constructor() {
    this.albumRepository = AlbumRepository
    this.requestService = RequestService
    this.imageService = ImageService
    this.trackService = TrackService
  }

  public getAll: IAlbumService['getAll'] = async (filter) => {
    try {
      return isEmpty(filter)
        ? this.albumRepository.findAll()
        : this.albumRepository.findAllWhere(filter)
    } catch (error: any) {
      throw createServerError('Error white getting albums')
    }
  }

  public createOne: IAlbumService['createOne'] = async (payload) => {
    let album: IAlbumDocument

    const serverError = createServerError('Error while creating new album')

    try {
      album = await this.albumRepository.createOne({
        name: payload.name,
        image: payload.image,
        releaseDate: payload.releaseDate,
        artist: payload.artist,
      })
    } catch (error) {
      if (isValidationError(error.name)) {
        throw createBadRequestError(error.message, {
          kind: ErrorKindsEnum.ValidationError,
          errors: error.errors,
        })
      }

      throw serverError
    }

    try {
      await this.requestService.createOne({
        creator: payload.userId,
        entity: album.id,
        entityName: ModelNamesEnum.Album,
      })

      return album
    } catch (error) {
      // log to file (Create request error)
      try {
        // log to file (начало удаления)
        await this.albumRepository.deleteOneById(album.id)
        // log to file (конец удаления)
        throw serverError
      } catch (error) {
        if (isHttpError(error)) {
          throw serverError
        }

        console.error(`Album by id "${album.id}" was not deleted`)
        // log not deleted album to file (Album by id "${album.id}" was not deleted)
        throw serverError
      }
    }
  }

  public getOneById: IAlbumService['getOneById'] = async (id) => {
    try {
      const album = await this.albumRepository.findOneById(id)
      return album
    } catch (error) {
      if (isNotFoundError(error)) {
        throw createNotFoundError(`Album with id "${id}" was not found`)
      }

      throw createServerError(`Error while getting album by id "${id}"`)
    }
  }

  public deleteOneById: IAlbumService['deleteOneById'] = async (id) => {
    let album: IAlbumDocument

    try {
      album = await this.albumRepository.deleteOneById(id)
    } catch (error) {
      if (isNotFoundError(error)) {
        throw createNotFoundError(`Album with id "${id}" was not found`)
      }

      throw createServerError(`Error while deleting album by id "${id}"`)
    }

    try {
      const albumHasImage = !!album.image

      if (albumHasImage) {
        const imageId = album.image as string
        await this.imageService.deleteOneById(imageId)
      }

      const tracksByAlbumId = await this.getTracksByAlbumId(album.id)
      const albumHasTracks = !isEmpty(tracksByAlbumId)

      if (albumHasTracks) {
        await this.trackService.deleteMany({ tracks: tracksByAlbumId })
      }

      await this.requestService.deleteOne({ entityId: album.id })

      return album
    } catch (error) {
      throw createServerError('Error while deleting related objects of album')
    }
  }

  public deleteMany: IAlbumService['deleteMany'] = async (filter) => {
    const albumsToDelete = get(filter, 'albums', [])

    const albumIds: DocumentIdArray = []
    const imageIds: DocumentIdArray = []

    albumsToDelete.forEach((album) => {
      albumIds.push(album.id)
      if (album.image) imageIds.push(album.image as string)
    })

    try {
      await this.albumRepository.deleteMany({ ids: albumIds })
    } catch (error) {
      if (isBadRequestError(error)) {
        if (isEmptyFilterError(error.kind)) {
          throw createBadRequestError(
            'Deleting many albums with empty filter forbidden',
          )
        }
      }

      throw createServerError('Error while deleting many albums')
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
      throw createServerError('Error while deleting related objects of albums')
    }
  }
}

export default new AlbumService()
