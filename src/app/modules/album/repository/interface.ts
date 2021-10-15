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
    id: DocumentId
  }> {}

export interface IDeleteManyAlbumsFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface IAlbumRepository {
  findAllWhere: (filter: IFindAllAlbumsFilter) => Promise<IAlbumDocumentArray>

  findOneById: (id: DocumentId) => Promise<IAlbumDocument>

  create: (payload: ICreateAlbumPayload) => Promise<IAlbumDocument>

  update: (
    filter: IUpdateAlbumFilter,
    payload: IUpdateAlbumPayload,
  ) => Promise<void>

  deleteOneById: (id: DocumentId) => Promise<IAlbumDocument>

  deleteMany: (filter: IDeleteManyAlbumsFilter) => Promise<void>
}
