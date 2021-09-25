import { AlbumModel } from 'api/album/model'
import { IAlbumRepository } from 'api/album/repository'
import dbErrorUtils from 'database/utils/errors'
import { NotFoundError } from 'shared/utils/errors/httpErrors'

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
      throw dbErrorUtils.isNotFound(error) ? NotFoundError.create() : error
    }
  }

  public deleteOneById: IAlbumRepository['deleteOneById'] = async (id) => {
    try {
      const album = await this.album.findByIdAndDelete(id).orFail().exec()
      return album
    } catch (error) {
      throw dbErrorUtils.isNotFound(error) ? NotFoundError.create() : error
    }
  }
}

export default new AlbumRepository()
