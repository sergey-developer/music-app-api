import { IAlbumRepository } from 'api/album/repository'

export interface IAlbumService {
  getAll: IAlbumRepository['findAllWhere']
  createOne: IAlbumRepository['createOne']
  getOneById: IAlbumRepository['findOneById']
}
