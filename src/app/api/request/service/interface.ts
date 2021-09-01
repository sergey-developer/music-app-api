import { GetAllRequestsQuery } from 'api/request/dto'
import { RequestDocumentArray } from 'api/request/interface'
import { IRequestDocument } from 'api/request/model'
import { DocumentId } from 'database/interface/document'

export interface IGetAllRequestsServiceFilter extends GetAllRequestsQuery {}

export interface IRequestService {
  getAll: (
    filter: IGetAllRequestsServiceFilter,
  ) => Promise<RequestDocumentArray>

  deleteOneById: (id: DocumentId<IRequestDocument>) => Promise<void>
}
