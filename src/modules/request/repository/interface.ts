import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { IRequestDocumentArray } from 'modules/request/interface'
import { IRequestDocument } from 'modules/request/model'
import {
  ICreateOneRequestServicePayload,
  IGetAllRequestsServiceFilter,
} from 'modules/request/service'

export interface ICreateOneRequestRepositoryPayload
  extends ICreateOneRequestServicePayload {}

export interface IFindAllRequestsRepositoryFilter
  extends IGetAllRequestsServiceFilter {}

export interface IDeleteOneRequestRepositoryFilter
  extends Partial<{
    id: DocumentId
    entityId: DocumentId
  }> {}

export interface IDeleteManyRequestRepositoryFilter
  extends Partial<{
    entityIds: DocumentIdArray
  }> {}

export interface IRequestRepository {
  findAll: () => Promise<IRequestDocumentArray>

  findAllWhere: (
    filter: IFindAllRequestsRepositoryFilter,
  ) => Promise<IRequestDocumentArray>

  createOne: (
    payload: ICreateOneRequestRepositoryPayload,
  ) => Promise<IRequestDocument>

  findOneById: (id: DocumentId) => Promise<IRequestDocument>

  deleteOne: (
    filter: IDeleteOneRequestRepositoryFilter,
  ) => Promise<IRequestDocument>

  deleteMany: (filter: IDeleteManyRequestRepositoryFilter) => Promise<void>
}
