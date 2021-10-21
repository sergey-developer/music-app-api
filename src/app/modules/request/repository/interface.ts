import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { GetAllRequestsQuery, UpdateRequestDto } from 'modules/request/dto'
import { IRequestDocumentArray } from 'modules/request/interface'
import { IRequestDocument } from 'modules/request/model'

export interface IFindAllRequestsFilter extends GetAllRequestsQuery {}

export interface ICreateRequestPayload
  extends Pick<IRequestDocument, 'entityName' | 'entity' | 'creator'> {}

export interface IUpdateRequestPayload extends UpdateRequestDto {}

export interface IUpdateRequestFilter
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

  findOneById: (id: IRequestDocument['id']) => Promise<IRequestDocument>

  createOne: (payload: ICreateRequestPayload) => Promise<IRequestDocument>

  updateOne: (
    filter: IUpdateRequestFilter,
    payload: IUpdateRequestPayload,
  ) => Promise<IRequestDocument>

  deleteOne: (filter: IDeleteOneRequestFilter) => Promise<IRequestDocument>

  deleteMany: (filter: IDeleteManyRequestFilter) => Promise<void>
}
