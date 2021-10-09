import isEmpty from 'lodash/isEmpty'

import { AlbumModel, IAlbumModel } from 'api/album/model'
import { IAlbumRepository } from 'api/album/repository'
import { isNotFoundDatabaseError } from 'database/utils/errors'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import {
  createBadRequestError,
  createNotFoundError,
  createServerError,
  isBadRequestError,
} from 'shared/utils/errors/httpErrors'

class AlbumRepository implements IAlbumRepository {
  private readonly album: IAlbumModel

  public constructor() {
    this.album = AlbumModel
  }

  public findAll: IAlbumRepository['findAll'] = async () => {
    return this.album.find().exec()
  }

  public findAllWhere: IAlbumRepository['findAllWhere'] = async ({
    artist,
  }) => {
    const filterByArtist = artist ? { artist } : {}
    const filter = { ...filterByArtist }

    return this.album.find(filter).exec()
  }

  public createOne: IAlbumRepository['createOne'] = async (payload) => {
    const album = new this.album(payload)
    return album.save()
  }

  public findOneById: IAlbumRepository['findOneById'] = async (id) => {
    try {
      const album = await this.album.findById(id).orFail().exec()
      return album
    } catch (error) {
      throw isNotFoundDatabaseError(error) ? createNotFoundError() : error
    }
  }

  public deleteOneById: IAlbumRepository['deleteOneById'] = async (id) => {
    try {
      const deletedAlbum = await this.album
        .findByIdAndDelete(id)
        .orFail()
        .exec()

      return deletedAlbum
    } catch (error) {
      throw isNotFoundDatabaseError(error) ? createNotFoundError() : error
    }
  }

  public deleteMany: IAlbumRepository['deleteMany'] = async ({ ids }) => {
    try {
      const idFilter = isEmpty(ids) ? {} : { _id: { $in: ids } }
      const filter = { ...idFilter }

      if (isEmpty(filter)) {
        throw createBadRequestError(null, {
          kind: ErrorKindsEnum.EmptyFilter,
        })
      }

      await this.album.deleteMany(filter)
    } catch (error) {
      throw isBadRequestError(error) ? error : createServerError()
    }
  }
}

export default new AlbumRepository()
