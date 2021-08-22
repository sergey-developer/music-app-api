import { IAlbumRepository } from 'api/album/repository'

export interface IAlbumService {
  getAll: IAlbumRepository['findAll']
  createOne: IAlbumRepository['createOne']
}
