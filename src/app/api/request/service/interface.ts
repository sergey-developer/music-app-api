import { IRequestDocument } from 'api/request/model'
import { IRequestRepository } from 'api/request/repository'
import { DocumentId } from 'database/interface/document'

export interface IRequestService {
  getAll: IRequestRepository['findAllWhere']
  deleteOneById: (id: DocumentId<IRequestDocument>) => Promise<void>
}
