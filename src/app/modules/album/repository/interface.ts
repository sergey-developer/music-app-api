import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { CreateAlbumDto, UpdateAlbumDto } from 'modules/album/dto'
import { IAlbumDocumentArray } from 'modules/album/interface'
import { IAlbumDocument } from 'modules/album/model'

export interface IFindAllAlbumsFilter
  extends Partial<{
    ids: DocumentIdArray
    artist: DocumentId
  }> {}

export interface ICreateAlbumPayload extends CreateAlbumDto {}

export interface IUpdateAlbumPayload extends UpdateAlbumDto {}

export interface IUpdateAlbumFilter
  extends Partial<{
    id: IAlbumDocument['id']
  }> {}

export interface IDeleteManyAlbumsFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface IAlbumRepository {
  findAllWhere: (filter: IFindAllAlbumsFilter) => Promise<IAlbumDocumentArray>

  findOneById: (id: IAlbumDocument['id']) => Promise<IAlbumDocument>

  createOne: (payload: ICreateAlbumPayload) => Promise<IAlbumDocument>

  updateOne: (
    filter: IUpdateAlbumFilter,
    payload: IUpdateAlbumPayload,
  ) => Promise<IAlbumDocument>

  deleteOneById: (id: IAlbumDocument['id']) => Promise<IAlbumDocument>

  deleteMany: (filter: IDeleteManyAlbumsFilter) => Promise<void>
}
