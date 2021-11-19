import isEmpty from 'lodash/isEmpty'
import { delay, inject, singleton } from 'tsyringe'

import EntityNamesEnum from 'database/constants/entityNamesEnum'
import DatabaseError from 'database/errors'
import { DocumentIdArray } from 'database/interface/document'
import logger from 'lib/logger'
import { IAlbumDocument } from 'modules/album/model'
import { AlbumRepository } from 'modules/album/repository'
import { IAlbumService } from 'modules/album/service'
import { RequestService } from 'modules/request/service'
import { ITrackDocumentArray } from 'modules/track/interface'
import { TrackService } from 'modules/track/service'
import {
  EMPTY_FILTER_ERR_MSG,
  VALIDATION_ERR_MSG,
} from 'shared/constants/errorMessages'
import { omitUndefined } from 'shared/utils/common'
import { AppError } from 'shared/utils/errors/appErrors'

@singleton()
class AlbumService implements IAlbumService {
  private getTracksByAlbumsIds = async (
    albumIds: DocumentIdArray,
  ): Promise<ITrackDocumentArray> => {
    return this.trackService.getAll({ albumIds })
  }

  public constructor(
    @inject(delay(() => AlbumRepository))
    private readonly albumRepository: AlbumRepository,

    private readonly requestService: RequestService,
    private readonly trackService: TrackService,
  ) {}

  public getAll: IAlbumService['getAll'] = async (filter) => {
    try {
      const { status, userId, artist } = filter

      const requests = await this.requestService.getAll({
        status,
        creator: userId,
        kind: EntityNamesEnum.Album,
      })

      const albumIds = requests.map((request) => {
        const entity = request.entity as IAlbumDocument
        return entity.id
      })

      const repoFilter = { artist, ids: albumIds }

      return this.albumRepository.findAllWhere(repoFilter)
    } catch (error: any) {
      logger.error(error.stack, {
        args: { filter },
      })

      throw new AppError.UnknownError('Error while getting albums')
    }
  }

  public getOneById: IAlbumService['getOneById'] = async (id) => {
    try {
      const album = await this.albumRepository.findOne({ id })
      return album
    } catch (error: any) {
      if (error instanceof DatabaseError.NotFoundError) {
        throw new AppError.NotFoundError('Album was not found')
      }

      logger.error(error.stack, {
        message: `Error while getting album by id "${id}"`,
      })

      throw new AppError.UnknownError('Error while getting album')
    }
  }

  public createOne: IAlbumService['createOne'] = async (payload) => {
    let album: IAlbumDocument
    const serverErrorMsg = 'Error while creating new album'

    try {
      album = await this.albumRepository.createOne({
        name: payload.name,
        image: payload.image,
        releaseDate: payload.releaseDate,
        artist: payload.artist,
      })
    } catch (error: any) {
      if (error instanceof DatabaseError.ValidationError) {
        throw new AppError.ValidationError(VALIDATION_ERR_MSG, error.errors)
      }

      logger.error(error.stack, {
        args: { payload },
      })

      throw new AppError.UnknownError(serverErrorMsg)
    }

    try {
      await this.requestService.createOne({
        entityName: EntityNamesEnum.Album,
        entity: album.id,
        creator: payload.userId,
      })

      return album
    } catch (error: any) {
      logger.error(error.stack, {
        message: `Error while creating request for album with id: "${album.id}"`,
      })

      try {
        await this.albumRepository.deleteOne({ id: album.id })
      } catch (error: any) {
        logger.warn(error.stack, {
          message: `Album by id "${album.id}" probably was not deleted`,
        })
      }

      throw new AppError.UnknownError(serverErrorMsg)
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
      if (error instanceof DatabaseError.NotFoundError) {
        throw new AppError.NotFoundError('Album was not found')
      }

      if (error instanceof DatabaseError.ValidationError) {
        throw new AppError.ValidationError(VALIDATION_ERR_MSG, error.errors)
      }

      logger.error(error.stack, {
        message: 'Update album error',
        args: { id, payload },
      })

      throw new AppError.UnknownError('Error while updating album')
    }
  }

  public deleteOneById: IAlbumService['deleteOneById'] = async (id) => {
    let album: IAlbumDocument
    const serverErrorMsg = 'Error while deleting album'

    try {
      album = await this.albumRepository.deleteOne({ id })
    } catch (error: any) {
      if (error instanceof DatabaseError.NotFoundError) {
        throw new AppError.NotFoundError('Album was not found')
      }

      logger.error(error.stack, {
        message: `Error while deleting album by id "${id}"`,
      })

      throw new AppError.UnknownError(serverErrorMsg)
    }

    try {
      const tracksByAlbumId = await this.getTracksByAlbumsIds([album.id])
      const albumHasTracks = !isEmpty(tracksByAlbumId)

      if (albumHasTracks) {
        await this.trackService.deleteMany({ tracks: tracksByAlbumId })
      }

      await this.requestService.deleteOne({ entityId: album.id })

      return album
    } catch (error: any) {
      logger.error(error.stack, {
        message: `Error while deleting related objects of album with id "${id}"`,
      })

      throw new AppError.UnknownError(serverErrorMsg)
    }
  }

  public deleteMany: IAlbumService['deleteMany'] = async (filter) => {
    const deleteManyFilter = omitUndefined(filter)

    if (isEmpty(deleteManyFilter)) {
      throw new AppError.ValidationError(EMPTY_FILTER_ERR_MSG)
    }

    const serverErrorMsg = 'Error while deleting albums'

    const { albums = [] } = deleteManyFilter
    const albumIds: DocumentIdArray = albums.map((album) => album.id)

    try {
      await this.albumRepository.deleteMany({ ids: albumIds })
    } catch (error: any) {
      logger.error(error.stack)
      throw new AppError.UnknownError(serverErrorMsg)
    }

    try {
      const tracksByAlbumsIds = await this.getTracksByAlbumsIds(albumIds)
      const albumsHaveTracks = !isEmpty(tracksByAlbumsIds)

      if (albumsHaveTracks) {
        await this.trackService.deleteMany({ tracks: tracksByAlbumsIds })
      }

      await this.requestService.deleteMany({ entityIds: albumIds })
    } catch (error: any) {
      logger.error(error.stack, {
        message: 'Error while deleting related objects of albums',
      })

      throw new AppError.UnknownError(serverErrorMsg)
    }
  }
}

export default AlbumService
