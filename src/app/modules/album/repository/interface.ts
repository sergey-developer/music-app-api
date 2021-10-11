import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { IAlbumDocumentArray } from 'modules/album/interface'
import { IAlbumDocument } from 'modules/album/model'
import { ICreateOneAlbumServicePayload } from 'modules/album/service'

export interface IFindAllAlbumsRepositoryFilter
  extends Partial<{
    ids: DocumentIdArray
    artist: DocumentId
  }> {}

export interface ICreateOneAlbumRepositoryPayload
  extends Omit<ICreateOneAlbumServicePayload, 'userId'> {}

export interface IDeleteManyAlbumsRepositoryFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface IAlbumRepository {
  findAllWhere: (
    filter: IFindAllAlbumsRepositoryFilter,
  ) => Promise<IAlbumDocumentArray>

  createOne: (
    payload: ICreateOneAlbumRepositoryPayload,
  ) => Promise<IAlbumDocument>

  findOneById: (id: DocumentId) => Promise<IAlbumDocument>

  deleteOneById: (id: DocumentId) => Promise<IAlbumDocument>

  deleteMany: (filter: IDeleteManyAlbumsRepositoryFilter) => Promise<void>
}
