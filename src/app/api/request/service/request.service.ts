import { IRequestRepository, RequestRepository } from 'api/request/repository'
import { IRequestService } from 'api/request/service'

class RequestService implements IRequestService {
  private readonly requestRepository: IRequestRepository

  constructor() {
    this.requestRepository = RequestRepository
  }

  getAll: IRequestService['getAll'] = async (filter) => {
    try {
      return this.requestRepository.findAllWhere(filter)
    } catch (error) {
      throw error
    }
  }
}

export default new RequestService()
