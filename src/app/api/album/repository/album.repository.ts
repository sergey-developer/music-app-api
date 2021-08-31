import { AlbumModel } from 'api/album/model'
import { IAlbumRepository } from 'api/album/repository'

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
    return this.album.findById(id).exec()
  }

  public deleteOneById: IAlbumRepository['deleteOneById'] = async (id) => {
    try {
      await this.album.findByIdAndDelete(id).orFail()
    } catch (error) {
      // TODO: throw custom not found if not found
      throw error
    }
  }
}

export default new AlbumRepository()
