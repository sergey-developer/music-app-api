import { GetAllRequestsQuery } from 'api/request/dto'
import { IRequestDocumentArray } from 'api/request/interface'
import { IRequestDocument } from 'api/request/model'
import { DocumentId } from 'database/interface/document'

export interface IGetAllRequestsServiceFilter extends GetAllRequestsQuery {}

export interface ICreateOneRequestServicePayload
  extends Pick<IRequestDocument, 'entityName' | 'entity' | 'creator'> {}

export interface IRequestService {
  getAll: (
    filter: IGetAllRequestsServiceFilter,
  ) => Promise<IRequestDocumentArray>

  createOne: (
    payload: ICreateOneRequestServicePayload,
  ) => Promise<IRequestDocument>

  deleteOneById: (id: DocumentId<IRequestDocument>) => Promise<void>
}
