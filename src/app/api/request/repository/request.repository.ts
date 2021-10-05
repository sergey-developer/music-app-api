import { RequestModel } from 'api/request/model'
import { IRequestRepository } from 'api/request/repository'
import { isNotFoundDatabaseError } from 'database/utils/errors'
import { createNotFoundError } from 'shared/utils/errors/httpErrors'

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

  public deleteOneById: IRequestRepository['deleteOneById'] = async (id) => {
    try {
      const request = await this.request
        .findByIdAndDelete(id)
        .orFail()
        .populate('entity')
        .exec()

      return request
    } catch (error) {
      throw isNotFoundDatabaseError(error) ? createNotFoundError() : error
    }
  }
}

export default new RequestRepository()
