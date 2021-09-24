import createError from 'http-errors'

import { AlbumModel } from 'api/album/model'
import { IAlbumRepository } from 'api/album/repository'
import { isNotFoundError } from 'database/utils/errors'

class AlbumRepository implements IAlbumRepository {
  private readonly album: typeof AlbumModel

  public constructor() {
    this.album = AlbumModel
  }

  public findAll: IAlbumRepository['findAll'] = async () => {
    return this.album.find().exec()
  }

  public findAllWhere: IAlbumRepository['findAllWhere'] = async (filter) => {
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
      throw isNotFoundError(error) ? new createError.NotFound() : error
    }
  }

  public deleteOneById: IAlbumRepository['deleteOneById'] = async (id) => {
    try {
      const album = await this.album.findByIdAndDelete(id).orFail().exec()
      return album
    } catch (error) {
      throw isNotFoundError(error) ? new createError.NotFound() : error
    }
  }
}

export default new AlbumRepository()
