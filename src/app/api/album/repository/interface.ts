import { CreateAlbumDto } from 'api/album/dto'
import { AlbumDocumentArray } from 'api/album/interface'
import { IAlbumDocument } from 'api/album/model'
import { IGetAllAlbumsServiceFilter } from 'api/album/service'
import { DocumentId } from 'database/interface/document'
import { MaybeNull } from 'shared/interface/utils/common'

export interface IFindAllAlbumsRepositoryFilter
  extends IGetAllAlbumsServiceFilter {}

export interface ICreateAlbumRepositoryPayload extends CreateAlbumDto {}

export interface IAlbumRepository {
  findAll: () => Promise<AlbumDocumentArray>

  findAllWhere: (
    filter: IFindAllAlbumsRepositoryFilter,
  ) => Promise<AlbumDocumentArray>

  createOne: (payload: ICreateAlbumRepositoryPayload) => Promise<IAlbumDocument>

  findOneById: (
    id: DocumentId<IAlbumDocument>,
  ) => Promise<MaybeNull<IAlbumDocument>>

  deleteOneById: (id: DocumentId<IAlbumDocument>) => Promise<void>
}
