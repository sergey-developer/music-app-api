import { AlbumModel } from 'api/album/model'
import { IAlbumRepository } from 'api/album/repository'

class AlbumRepository implements IAlbumRepository {
  private readonly album: typeof AlbumModel

  constructor() {
    this.album = AlbumModel
  }

  findAll: IAlbumRepository['findAll'] = async () => {
    return this.album.find()
  }

  findAllWhere: IAlbumRepository['findAllWhere'] = async (filter) => {
    return this.album.find(filter)
  }

  createOne: IAlbumRepository['createOne'] = async (payload) => {
    const album = new this.album(payload)
    return album.save()
  }

  findOneById: IAlbumRepository['findOneById'] = async (id) => {
    return this.album.findById(id).exec()
  }
}

export default new AlbumRepository()
