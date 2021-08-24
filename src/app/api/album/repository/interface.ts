import { CreateAlbumDto } from 'api/album/dto'
import { AlbumModelArray, GetAllAlbumsFilterDto } from 'api/album/interface'
import { IAlbumModel } from 'api/album/model'
import { MaybeNull } from 'shared/interface/utils/common'
import { ModelId } from 'shared/interface/utils/model'

export interface IAlbumRepository {
  findAll: () => Promise<AlbumModelArray>
  findAllWhere: (filter: GetAllAlbumsFilterDto) => Promise<AlbumModelArray>
  createOne: (payload: CreateAlbumDto) => Promise<IAlbumModel>
  findOneById: (id: ModelId<IAlbumModel>) => Promise<MaybeNull<IAlbumModel>>
}
