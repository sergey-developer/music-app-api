import { QueryOptions } from 'mongoose'

import { IAlbumDocumentArray } from 'api/album/interface'
import { IAlbumDocument } from 'api/album/model'
import {
  ICreateOneAlbumServicePayload,
  IGetAllAlbumsServiceFilter,
} from 'api/album/service'
import { DocumentId, DocumentIdArray } from 'database/interface/document'

export interface IFindAllAlbumsRepositoryFilter
  extends IGetAllAlbumsServiceFilter {}

export interface ICreateOneAlbumRepositoryPayload
  extends Omit<ICreateOneAlbumServicePayload, 'userId'> {}

export interface IDeleteManyAlbumsRepositoryFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface IAlbumRepository {
  findAll: () => Promise<IAlbumDocumentArray>

  findAllWhere: (
    filter: IFindAllAlbumsRepositoryFilter,
  ) => Promise<IAlbumDocumentArray>

  createOne: (
    payload: ICreateOneAlbumRepositoryPayload,
  ) => Promise<IAlbumDocument>

  findOneById: (
    id: DocumentId,
    options?: QueryOptions,
  ) => Promise<IAlbumDocument>

  deleteOneById: (id: DocumentId) => Promise<IAlbumDocument>

  deleteMany: (filter: IDeleteManyAlbumsRepositoryFilter) => Promise<void>
}
