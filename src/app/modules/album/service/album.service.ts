import isEmpty from 'lodash/isEmpty'
import { singleton } from 'tsyringe'

import { ModelNamesEnum } from 'database/constants'
import { DocumentIdArray } from 'database/interface/document'
import { isNotFoundDBError } from 'database/utils/errors'
import logger from 'lib/logger'
import { IAlbumDocument } from 'modules/album/model'
import { AlbumRepository } from 'modules/album/repository'
import { IAlbumService } from 'modules/album/service'
import { RequestService } from 'modules/request/service'
import { ITrackDocumentArray } from 'modules/track/interface'
import { TrackService } from 'modules/track/service'
import { EMPTY_FILTER_ERR_MSG } from 'shared/constants/errorMessages'
import { omitUndefined } from 'shared/utils/common'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
} from 'shared/utils/errors/httpErrors'

@singleton()
class AlbumService implements IAlbumService {
  private getTracksByAlbumsIds = async (
    albumIds: DocumentIdArray,
  ): Promise<ITrackDocumentArray> => {
    return this.trackService.getAll({ albumIds })
  }

  public constructor(
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
          message: `Album by id "${album.id}" probably was not deleted`,
        })
      }

      throw serverError
    }
  }

  public updateOneById: IAlbumService['updateOneById'] = async (
    id,
    payload,
  ) => {
    try {
      await this.albumRepository.updateOne({ id }, payload)
    } catch (error) {
      if (isValidationError(error.name)) {
        throw BadRequestError(error.message, {
          kind: error.name,
          errors: error.errors,
        })
      }

      if (isNotFoundDBError(error)) {
        throw NotFoundError('Album was not found')
      }

      logger.error(error.stack, {
        message: 'Update album error',
        args: { id, payload },
      })

      throw ServerError('Error while updating album')
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

  public deleteMany: IAlbumService['deleteMany'] = async (rawFilter) => {
    const filter: typeof rawFilter = omitUndefined(rawFilter)

    if (isEmpty(filter)) {
      throw BadRequestError(EMPTY_FILTER_ERR_MSG)
    }

    const serverErrorMsg = 'Error while deleting albums'

    const { albums = [] } = filter

    const albumIds: DocumentIdArray = albums.map((album) => album.id)

    try {
      await this.albumRepository.deleteMany({ ids: albumIds })
    } catch (error) {
      logger.error(error.stack)
      throw ServerError(serverErrorMsg)
    }

    try {
      const tracksByAlbumsIds = await this.getTracksByAlbumsIds(albumIds)
      const albumsHaveTracks = !isEmpty(tracksByAlbumsIds)

      if (albumsHaveTracks) {
        await this.trackService.deleteMany({ tracks: tracksByAlbumsIds })
      }

      await this.requestService.deleteMany({ entityIds: albumIds })
    } catch (error) {
      logger.error(error.stack, {
        message: 'Error while deleting related objects of albums',
      })

      throw ServerError(serverErrorMsg)
    }
  }
}

export default AlbumService
