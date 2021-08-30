import { IRequestRepository } from 'api/request/repository'

export interface IRequestService {
  getAll: IRequestRepository['findAllWhere']
}
