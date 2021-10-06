import _isEmpty from 'lodash/isEmpty'

import { IAlbumDocument } from 'api/album/model'
import { AlbumRepository, IAlbumRepository } from 'api/album/repository'
import { IAlbumService } from 'api/album/service'
import { IImageDocument } from 'api/image/model'
import { IImageService, ImageService } from 'api/image/service'
import { IRequestService, RequestService } from 'api/request/service'
import { ITrackDocumentArray } from 'api/track/interface'
import { ITrackService, TrackService } from 'api/track/service'
import { ModelNamesEnum } from 'database/constants'
import { DocumentId } from 'database/interface/document'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import {
  createBadRequestError,
  createNotFoundError,
  createServerError,
  isHttpError,
  isNotFoundError,
} from 'shared/utils/errors/httpErrors'
import isValidationError from 'shared/utils/errors/isValidationError'

class AlbumService implements IAlbumService {
  private readonly albumRepository: IAlbumRepository
  private readonly requestService: IRequestService
  private readonly imageService: IImageService
  private readonly trackService: ITrackService

  private getTracksByAlbumsIds = async (
    albumIds: Array<DocumentId<IAlbumDocument>>,
  ): Promise<ITrackDocumentArray> => {
    return this.trackService.getAll({ albumIds })
  }

  private getTracksByAlbumId = async (
    albumsId: DocumentId<IAlbumDocument>,
  ): Promise<ITrackDocumentArray> => {
    return this.trackService.getAll({ album: albumsId })
  }

  public constructor() {
    this.albumRepository = AlbumRepository
    this.requestService = RequestService
    this.imageService = ImageService
    this.trackService = TrackService
  }

  public getAll: IAlbumService['getAll'] = async (filter) => {
    try {
      return _isEmpty(filter)
        ? this.albumRepository.findAll()
        : this.albumRepository.findAllWhere(filter)
    } catch (error: any) {
      throw createServerError('Error white getting albums')
    }
  }

  public createOne: IAlbumService['createOne'] = async (payload) => {
    let album: IAlbumDocument

    const serverError = createServerError('Error while creating Album')

    try {
      album = await this.albumRepository.createOne({
        name: payload.name,
        image: payload.image,
        releaseDate: payload.releaseDate,
        artist: payload.artist,
      })
    } catch (error: any) {
      if (isValidationError(error)) {
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
    try {
      const album = await this.albumRepository.deleteOneById(id)
      const albumHasImage = !!album.image

      if (albumHasImage) {
        const imageId = album.image
        await this.imageService.deleteOneById(imageId)
      }

      const tracksByAlbumId = await this.getTracksByAlbumId(album.id)
      const albumHaveTracks = !_isEmpty(tracksByAlbumId)

      if (albumHaveTracks) {
        await this.trackService.deleteMany({ tracks: tracksByAlbumId })
      }

      await this.requestService.deleteOne({ entityId: album.id })

      return album
    } catch (error) {
      if (isNotFoundError(error)) {
        throw createNotFoundError(`Album with id "${id}" was not found`)
      }

      throw createServerError(`Error while deleting album by id "${id}"`)
    }
  }

  public deleteMany: IAlbumService['deleteMany'] = async (filter) => {
    if (_isEmpty(filter)) return

    const albumsForDeleting = filter.albums || []

    if (_isEmpty(albumsForDeleting)) return

    const albumIds: Array<DocumentId<IAlbumDocument>> = []
    const imageIds: Array<DocumentId<IImageDocument>> = []

    try {
      albumsForDeleting.forEach((album) => {
        albumIds.push(album.id)
        if (album.image) imageIds.push(album.image)
      })

      await this.albumRepository.deleteMany({ ids: albumIds })

      if (!_isEmpty(imageIds)) {
        await this.imageService.deleteMany({ ids: imageIds })
      }

      const tracksByAlbumsIds = await this.getTracksByAlbumsIds(albumIds)
      const albumsHaveTracks = !_isEmpty(tracksByAlbumsIds)

      if (albumsHaveTracks) {
        await this.trackService.deleteMany({ tracks: tracksByAlbumsIds })
      }

      await this.requestService.deleteMany({ entityIds: albumIds })
    } catch (error) {
      throw createServerError()
    }
  }
}

export default new AlbumService()
