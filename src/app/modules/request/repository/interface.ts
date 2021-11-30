import { DeleteResult } from 'mongodb'

import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { IRequestDocument } from 'modules/../../../../database/models/request/model'
import { GetAllRequestsQuery, UpdateRequestDto } from 'modules/request/dto'
import { IRequestDocumentArray } from 'modules/request/interface'

export interface IFindAllRequestsFilter extends GetAllRequestsQuery {}

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
  extends Partial<Pick<IRequestDocument, 'id'>> {}

export interface IDeleteOneRequestFilter
  extends Partial<{
    id: IRequestDocument['id']
    entityId: DocumentId
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
