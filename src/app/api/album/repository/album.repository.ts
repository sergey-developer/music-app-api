import { AlbumModel } from 'api/album/model'
import { IAlbumRepository } from 'api/album/repository'
import { isNotFoundDatabaseError } from 'database/utils/errors'
import { createNotFoundError } from 'shared/utils/errors/httpErrors'

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

  public findOneById: IAlbumRepository['findOneById'] = async (id, options) => {
    try {
      const album = await this.album.findById(id, null, options).orFail().exec()

      return album
    } catch (error: any) {
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

  public deleteMany: IAlbumRepository['deleteMany'] = async (filter) => {
    try {
      const filterById = filter.ids?.length ? { _id: { $in: filter.ids } } : {}
      await this.album.deleteMany({ ...filterById })
    } catch (error) {
      throw isNotFoundDatabaseError(error) ? createNotFoundError() : error
    }
  }
}

export default new AlbumRepository()
