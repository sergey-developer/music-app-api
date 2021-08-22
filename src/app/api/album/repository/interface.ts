// import { FilterQuery, QueryFindOptions } from 'mongoose'

import { CreateAlbumDto } from 'api/album/dto'
import { AlbumModelArray, IAlbumModel } from 'api/album/model'

export interface IAlbumRepository {
  findAll: () => Promise<AlbumModelArray>
  createOne: (payload: CreateAlbumDto) => Promise<IAlbumModel>
}
