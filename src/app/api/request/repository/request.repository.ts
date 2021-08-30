import { RequestModel } from 'api/request/model'
import { IRequestRepository } from 'api/request/repository'

class RequestRepository implements IRequestRepository {
  private readonly request: typeof RequestModel

  constructor() {
    this.request = RequestModel
  }

  findAllWhere: IRequestRepository['findAllWhere'] = async (filter) => {
    // TODO: refactor
    const entityNameCond = filter.kind ? { entityName: filter.kind } : {}
    const statusCond = filter.status ? { status: filter.status } : {}
    const creatorCond = filter.creator ? { creator: filter.creator } : {}

    return this.request
      .find({
        $and: [entityNameCond, statusCond, creatorCond],
      })
      .populate('entity')
      .exec()
  }

  createOne: IRequestRepository['createOne'] = async (payload) => {
    const request = new this.request(payload)
    return request.save()
  }
}

export default new RequestRepository()
