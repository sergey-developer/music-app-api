import { RequestModel } from 'api/request/model'
import { IRequestRepository } from 'api/request/repository'

class RequestRepository implements IRequestRepository {
  private readonly request: typeof RequestModel

  public constructor() {
    this.request = RequestModel
  }

  public findAllWhere: IRequestRepository['findAllWhere'] = async (filter) => {
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

  public createOne: IRequestRepository['createOne'] = async (payload) => {
    const request = new this.request(payload)
    return request.save()
  }

  // unused
  public findOneById: IRequestRepository['findOneById'] = async (id) => {
    return this.request.findById(id)
  }

  public findOneByIdAndDelete: IRequestRepository['findOneByIdAndDelete'] =
    async (id) => {
      try {
        return this.request
          .findByIdAndDelete(id)
          .orFail()
          .populate('entity')
          .exec()
      } catch (error) {
        // TODO: throw custom not found if not found
        throw error
      }
    }
}

export default new RequestRepository()
