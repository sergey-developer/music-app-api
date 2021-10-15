import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { IAlbumDocumentArray } from 'modules/album/interface'
import { IAlbumDocument } from 'modules/album/model'
import {
  ICreateAlbumServicePayload,
  IUpdateAlbumServiceFilter,
  IUpdateAlbumServicePayload,
} from 'modules/album/service'

export interface IFindAllAlbumsRepositoryFilter
  extends Partial<{
    ids: DocumentIdArray
    artist: DocumentId
  }> {}

export interface ICreateAlbumRepositoryPayload
  extends Omit<ICreateAlbumServicePayload, 'userId'> {}

export interface IUpdateAlbumRepositoryPayload
  extends IUpdateAlbumServicePayload {}

export interface IUpdateAlbumRepositoryFilter
  extends IUpdateAlbumServiceFilter {}

export interface IDeleteManyAlbumsRepositoryFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface IAlbumRepository {
  findAllWhere: (
    filter: IFindAllAlbumsRepositoryFilter,
  ) => Promise<IAlbumDocumentArray>

  findOneById: (id: DocumentId) => Promise<IAlbumDocument>

  create: (payload: ICreateAlbumRepositoryPayload) => Promise<IAlbumDocument>

  update: (
    filter: IUpdateAlbumRepositoryFilter,
    payload: IUpdateAlbumRepositoryPayload,
  ) => Promise<void>

  deleteOneById: (id: DocumentId) => Promise<IAlbumDocument>

  deleteMany: (filter: IDeleteManyAlbumsRepositoryFilter) => Promise<void>
}
