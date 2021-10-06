import { IAlbumDocument } from 'api/album/model'
import { IArtistDocument } from 'api/artist/model'
import { IRequestDocumentArray } from 'api/request/interface'
import { IRequestDocument } from 'api/request/model'
import {
  ICreateOneRequestServicePayload,
  IGetAllRequestsServiceFilter,
} from 'api/request/service'
import { ITrackDocument } from 'api/track/model'
import { DocumentId } from 'database/interface/document'

export interface ICreateOneRequestRepositoryPayload
  extends ICreateOneRequestServicePayload {}

export interface IFindAllRequestsRepositoryFilter
  extends IGetAllRequestsServiceFilter {}

export interface IDeleteOneRequestRepositoryFilter
  extends Partial<{
    id: DocumentId<IRequestDocument>
    entityId:
      | DocumentId<IArtistDocument>
      | DocumentId<IAlbumDocument>
      | DocumentId<ITrackDocument>
  }> {}

export interface IDeleteManyRequestRepositoryFilter
  extends Partial<{
    entityIds: Array<
      | DocumentId<IArtistDocument>
      | DocumentId<IAlbumDocument>
      | DocumentId<ITrackDocument>
    >
  }> {}

export interface IRequestRepository {
  findAllWhere: (
    filter: IFindAllRequestsRepositoryFilter,
  ) => Promise<IRequestDocumentArray>

  createOne: (
    payload: ICreateOneRequestRepositoryPayload,
  ) => Promise<IRequestDocument>

  findOneById: (id: DocumentId<IRequestDocument>) => Promise<IRequestDocument>

  deleteOne: (
    filter: IDeleteOneRequestRepositoryFilter,
  ) => Promise<IRequestDocument>

  deleteMany: (filter: IDeleteManyRequestRepositoryFilter) => Promise<void>
}
