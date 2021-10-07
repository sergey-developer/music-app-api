import isEmpty from 'lodash/isEmpty'

import { IRequestModel, RequestModel } from 'api/request/model'
import { IRequestRepository } from 'api/request/repository'
import { isNotFoundDatabaseError } from 'database/utils/errors'
import { createNotFoundError } from 'shared/utils/errors/httpErrors'

class RequestRepository implements IRequestRepository {
  private readonly request: IRequestModel

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
      .exec()
  }

  public createOne: IRequestRepository['createOne'] = async (payload) => {
    const request = new this.request(payload)
    return request.save()
  }

  public findOneById: IRequestRepository['findOneById'] = async (id) => {
    try {
      const request = await this.request.findById(id).orFail().exec()
      return request
    } catch (error) {
      throw isNotFoundDatabaseError(error) ? createNotFoundError() : error
    }
  }

  public deleteOne: IRequestRepository['deleteOne'] = async ({
    id,
    entityId,
  }) => {
    try {
      const filterById = id ? { _id: id } : {}
      const filterByEntity = entityId ? { entity: entityId } : {}
      const filter = { ...filterById, ...filterByEntity }

      // TODO: handle case when filter is empty
      const request = await this.request
        .findOneAndDelete(filter)
        .orFail()
        .populate('entity')
        .exec()

      return request
    } catch (error) {
      throw isNotFoundDatabaseError(error) ? createNotFoundError() : error
    }
  }

  public deleteMany: IRequestRepository['deleteMany'] = async ({
    entityIds,
  }) => {
    try {
      const filterByEntityIds = isEmpty(entityIds)
        ? {}
        : { entity: { $in: entityIds } }

      const filter = { ...filterByEntityIds }

      await this.request.deleteMany(filter)
    } catch (error) {
      throw error
    }
  }
}

export default new RequestRepository()
