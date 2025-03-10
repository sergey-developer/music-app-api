import isEmpty from 'lodash/isEmpty'
import { delay, inject, singleton } from 'tsyringe'

import {
  EMPTY_FILTER_ERR_MSG,
  VALIDATION_ERR_MSG,
} from 'app/constants/messages/errors'
import { omitUndefined } from 'app/utils/common'
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
import { DocumentIdArray } from 'database/interface/document'
import { IAlbumDocument } from 'database/models/album'
import logger from 'lib/logger'
import { AlbumRepository } from 'modules/album/repository'
import { IAlbumService } from 'modules/album/service'
import { ImageService } from 'modules/image/service'
import { RequestService } from 'modules/request/service'
import { TrackService } from 'modules/track/service'

@singleton()
class AlbumService implements IAlbumService {
  public constructor(
    @inject(delay(() => AlbumRepository))
    private readonly albumRepository: AlbumRepository,

    private readonly requestService: RequestService,
    private readonly trackService: TrackService,
    private readonly imageService: ImageService,
  ) {}

  public getAll: IAlbumService['getAll'] = async (filter) => {
    try {
      const { status, userId, artist } = filter

      const requests = await this.requestService.getAll({
        status,
        creator: userId,
        kind: EntityNamesEnum.Album,
      })

      if (isEmpty(requests)) {
        return []
      }

      const albumIds = requests.map((request) => {
        const entity = request.entity as IAlbumDocument
        return entity.id
      })

      const albums = await this.albumRepository.findAllWhere({
        artist,
        ids: albumIds,
      })

      return albums
    } catch (error: any) {
      logger.error(error.stack, {
        args: { filter },
      })

      throw new AppUnknownError('Error while getting albums')
    }
  }

  public getOneById: IAlbumService['getOneById'] = async (id) => {
    try {
      const album = await this.albumRepository.findOne({ id })
      return album
    } catch (error: any) {
      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError('Album was not found')
      }

      logger.error(error.stack, {
        message: `Error while getting album by id "${id}"`,
      })

      throw new AppUnknownError('Error while getting album')
    }
  }

  public createOne: IAlbumService['createOne'] = async (payload) => {
    let album: IAlbumDocument
    const unknownErrorMsg = 'Error while creating new album'

    try {
      album = await this.albumRepository.createOne({
        name: payload.name,
        image: payload.image,
        releaseDate: payload.releaseDate,
        artist: payload.artist,
      })
    } catch (error: any) {
      if (payload.image) {
        this.imageService.deleteOneByName(payload.image)
      }

      if (isDatabaseValidationError(error)) {
        throw new AppValidationError(VALIDATION_ERR_MSG, error.errors)
      }

      logger.error(error.stack, {
        args: { payload },
      })

      throw new AppUnknownError(unknownErrorMsg)
    }

    try {
      await this.requestService.createOne({
        entityName: EntityNamesEnum.Album,
        entity: album.id,
        creator: payload.user,
      })

      return album
    } catch (error: any) {
      logger.error(error.stack, {
        message: `Error while creating request for album with id: "${album.id}"`,
      })

      try {
        await this.albumRepository.deleteOne({ id: album.id })

        if (album.image) {
          this.imageService.deleteOneByName(album.image)
        }
      } catch (error: any) {
        logger.warn(error.stack, {
          message: `Album by id "${album.id}" probably was not deleted`,
        })

        if (album.image) {
          this.imageService.deleteOneByName(album.image)
        }
      }

      throw new AppUnknownError(unknownErrorMsg)
    }
  }

  public updateOneById: IAlbumService['updateOneById'] = async (
    id,
    payload,
  ) => {
    try {
      const updatedAlbum = await this.albumRepository.updateOne({ id }, payload)
      return updatedAlbum
    } catch (error: any) {
      if (payload.image) {
        this.imageService.deleteOneByName(payload.image)
      }

      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError('Album was not found')
      }

      if (isDatabaseValidationError(error)) {
        throw new AppValidationError(VALIDATION_ERR_MSG, error.errors)
      }

      logger.error(error.stack, {
        message: 'Update album error',
        args: { id, payload },
      })

      throw new AppUnknownError('Error while updating album')
    }
  }

  public deleteOneById: IAlbumService['deleteOneById'] = async (id) => {
    let album: IAlbumDocument
    const unknownErrorMsg = 'Error while deleting album'

    try {
      album = await this.albumRepository.deleteOne({ id })

      if (album.image) {
        this.imageService.deleteOneByName(album.image)
      }
    } catch (error: any) {
      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError('Album was not found')
      }

      logger.error(error.stack, {
        message: `Error while deleting album by id "${id}"`,
      })

      throw new AppUnknownError(unknownErrorMsg)
    }

    try {
      const tracksByAlbumId = await this.trackService.getAll({
        albumId: album.id,
      })

      const albumHasTracks = !isEmpty(tracksByAlbumId)

      if (albumHasTracks) {
        await this.trackService.deleteMany({ tracks: tracksByAlbumId })
      }

      await this.requestService.deleteOne({ entity: album.id })

      return album
    } catch (error: any) {
      logger.error(error.stack, {
        message: `Error while deleting related objects of album with id "${id}"`,
      })

      throw new AppUnknownError(unknownErrorMsg)
    }
  }

  public deleteMany: IAlbumService['deleteMany'] = async (filter) => {
    const deleteManyFilter = omitUndefined(filter)

    if (isEmpty(deleteManyFilter)) {
      throw new AppValidationError(EMPTY_FILTER_ERR_MSG)
    }

    const unknownErrorMsg = 'Error while deleting albums'

    const { albums = [] } = deleteManyFilter
    const albumIds: DocumentIdArray = []
    const albumImageNames: string[] = []
    let deletionResult

    albums.forEach((album) => {
      albumIds.push(album.id)

      if (album.image) {
        albumImageNames.push(album.image)
      }
    })

    try {
      deletionResult = await this.albumRepository.deleteMany({ ids: albumIds })
      this.imageService.deleteManyByNames(albumImageNames)
    } catch (error: any) {
      logger.error(error.stack)
      throw new AppUnknownError(unknownErrorMsg)
    }

    try {
      const tracksByAlbumsIds = await this.trackService.getAll({
        albumIds,
      })

      const albumsHaveTracks = !isEmpty(tracksByAlbumsIds)

      if (albumsHaveTracks) {
        await this.trackService.deleteMany({ tracks: tracksByAlbumsIds })
      }

      await this.requestService.deleteMany({ entityIds: albumIds })

      return deletionResult
    } catch (error: any) {
      logger.error(error.stack, {
        message: 'Error while deleting related objects of albums',
      })

      throw new AppUnknownError(unknownErrorMsg)
    }
  }
}

export default AlbumService
