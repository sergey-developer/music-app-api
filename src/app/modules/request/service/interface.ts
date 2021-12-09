import { DeleteResult } from 'mongodb'

import { DocumentId, DocumentIdArray } from 'database/interface/document'
import {
  IRequestDocument,
  IRequestDocumentArray,
} from 'database/models/request'
import { GetAllRequestsQuery, UpdateRequestDto } from 'modules/request/dto'

export interface IGetAllRequestsFilter extends GetAllRequestsQuery {}

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

export interface IRequestService {
  getAll: (filter: IGetAllRequestsFilter) => Promise<IRequestDocumentArray>

  createOne: (payload: ICreateOneRequestPayload) => Promise<IRequestDocument>

  updateOne: (
    filter: IUpdateOneRequestFilter,
    payload: IUpdateOneRequestPayload,
  ) => Promise<IRequestDocument>

  deleteOne: (filter: IDeleteOneRequestFilter) => Promise<IRequestDocument>

  deleteOneWithEntity: (
    requestId: IRequestDocument['id'],
  ) => Promise<IRequestDocument>

  deleteMany: (filter: IDeleteManyRequestFilter) => Promise<DeleteResult>
}
