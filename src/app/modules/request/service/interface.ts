import { DocumentId } from 'database/interface/document'
import { GetAllRequestsQuery } from 'modules/request/dto'
import { IRequestDocumentArray } from 'modules/request/interface'
import { IRequestDocument } from 'modules/request/model'
import { IRequestRepository } from 'modules/request/repository'

export interface IGetAllRequestsServiceFilter extends GetAllRequestsQuery {}

export interface ICreateRequestServicePayload
  extends Pick<IRequestDocument, 'entityName' | 'entity' | 'creator'> {}

export interface IRequestService {
  getAll: (
    filter: IGetAllRequestsServiceFilter,
  ) => Promise<IRequestDocumentArray>

  create: (payload: ICreateRequestServicePayload) => Promise<IRequestDocument>

  deleteOne: IRequestRepository['deleteOne']

  deleteOneWithEntity: (requestId: DocumentId) => Promise<IRequestDocument>

  deleteMany: IRequestRepository['deleteMany']
}
