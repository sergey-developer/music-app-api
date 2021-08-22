import { IAlbumRepository } from 'api/album/repository'

export interface IAlbumService {
  getAll: IAlbumRepository['findAll']
  getAllWhere: IAlbumRepository['findAllWhere']
  createOne: IAlbumRepository['createOne']
  getOneById: IAlbumRepository['findOneById']
}
