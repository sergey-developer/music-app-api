import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { IRequestDocumentArray } from 'modules/request/interface'
import { IRequestDocument } from 'modules/request/model'
import {
  ICreateRequestServicePayload,
  IGetAllRequestsServiceFilter,
} from 'modules/request/service'

export interface ICreateRequestRepositoryPayload
  extends ICreateRequestServicePayload {}

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

  findOneById: (id: DocumentId) => Promise<IRequestDocument>

  create: (
    payload: ICreateRequestRepositoryPayload,
  ) => Promise<IRequestDocument>

  deleteOne: (
    filter: IDeleteOneRequestRepositoryFilter,
  ) => Promise<IRequestDocument>

  deleteMany: (filter: IDeleteManyRequestRepositoryFilter) => Promise<void>
}
