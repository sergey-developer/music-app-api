import { GetAllRequestsQuery } from 'api/request/dto'
import { IRequestDocumentArray } from 'api/request/interface'
import { IRequestDocument } from 'api/request/model'
import { IRequestRepository } from 'api/request/repository'

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

  deleteOneById: IRequestRepository['deleteOneById']
}
