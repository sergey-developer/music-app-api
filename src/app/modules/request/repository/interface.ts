import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { GetAllRequestsQuery } from 'modules/request/dto'
import { IRequestDocumentArray } from 'modules/request/interface'
import { IRequestDocument } from 'modules/request/model'

export interface ICreateRequestPayload
  extends Pick<IRequestDocument, 'entityName' | 'entity' | 'creator'> {}

export interface IFindAllRequestsFilter extends GetAllRequestsQuery {}

export interface IDeleteOneRequestFilter
  extends Partial<{
    id: DocumentId
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

  findOneById: (id: DocumentId) => Promise<IRequestDocument>

  create: (payload: ICreateRequestPayload) => Promise<IRequestDocument>

  deleteOne: (filter: IDeleteOneRequestFilter) => Promise<IRequestDocument>

  deleteMany: (filter: IDeleteManyRequestFilter) => Promise<void>
}
