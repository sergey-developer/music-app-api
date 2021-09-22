import { GetAllRequestsQuery } from 'api/request/dto'
import { IRequestDocumentArray } from 'api/request/interface'
import { IRequestDocument } from 'api/request/model'
import { DocumentId } from 'database/interface/document'

export interface IGetAllRequestsServiceFilter extends GetAllRequestsQuery {}

export interface IRequestService {
  getAll: (
    filter: IGetAllRequestsServiceFilter,
  ) => Promise<IRequestDocumentArray>

  deleteOneById: (id: DocumentId<IRequestDocument>) => Promise<void>
}
