import { DeleteResult } from 'mongodb'

import { DocumentId, DocumentIdArray } from 'database/interface/document'
import {
  IRequestDocument,
  IRequestDocumentArray,
} from 'database/models/request'
import { GetAllRequestsQuery, UpdateRequestDto } from 'modules/request/dto'

export interface IFindAllRequestsFilter
  extends GetAllRequestsQuery,
    Partial<{
      entity: DocumentId
    }> {}

export interface IFindOneRequestFilter
  extends Partial<{
    id: IRequestDocument['id']
    entity: DocumentId
  }> {}

export interface ICreateOneRequestPayload
  extends Pick<IRequestDocument, 'entityName'> {
  entity: string
  creator: string
}

export interface IUpdateOneRequestPayload extends UpdateRequestDto {}

export interface IUpdateOneRequestFilter
  extends Partial<{
    id: IRequestDocument['id']
    entity: DocumentId
  }> {}

export interface IDeleteOneRequestFilter
  extends Partial<{
    id: IRequestDocument['id']
    entity: DocumentId
  }> {}

export interface IDeleteManyRequestFilter
  extends Partial<{
    entityIds: DocumentIdArray
  }> {}

export interface IRequestRepository {
  findAll: () => Promise<IRequestDocumentArray>

  findAllWhere: (
    filter: IFindAllRequestsFilter,
  ) => Promise<IRequestDocumentArray>

  findOne: (filter: IFindOneRequestFilter) => Promise<IRequestDocument>

  createOne: (payload: ICreateOneRequestPayload) => Promise<IRequestDocument>

  updateOne: (
    filter: IUpdateOneRequestFilter,
    payload: IUpdateOneRequestPayload,
  ) => Promise<IRequestDocument>

  deleteOne: (filter: IDeleteOneRequestFilter) => Promise<IRequestDocument>

  deleteMany: (filter: IDeleteManyRequestFilter) => Promise<DeleteResult>
}
