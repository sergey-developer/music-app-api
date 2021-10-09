import isEmpty from 'lodash/isEmpty'
import { FilterQuery } from 'mongoose'

import {
  IRequestDocument,
  IRequestModel,
  RequestModel,
} from 'api/request/model'
import { IRequestRepository } from 'api/request/repository'
import { isNotFoundDatabaseError } from 'database/utils/errors'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { omitUndefined } from 'shared/utils/common'
import {
  badRequestError,
  isBadRequestError,
  notFoundError,
  serverError,
} from 'shared/utils/errors/httpErrors'

class RequestRepository implements IRequestRepository {
  private readonly request: IRequestModel

  public constructor() {
    this.request = RequestModel
  }

  public findAll: IRequestRepository['findAll'] = async () => {
    return this.request.find().exec()
  }

  public findAllWhere: IRequestRepository['findAllWhere'] = async (filter) => {
    const { status, creator, kind }: typeof filter = omitUndefined(filter)

    const filterByEntityName: FilterQuery<IRequestDocument> = kind
      ? { entityName: kind }
      : {}

    const filterByStatus: FilterQuery<IRequestDocument> = status
      ? { status }
      : {}

    const filterByCreator: FilterQuery<IRequestDocument> = creator
      ? { creator }
      : {}

    const andConditions: Array<FilterQuery<IRequestDocument>> = []

    if (!isEmpty(filterByEntityName)) andConditions.push(filterByEntityName)
    if (!isEmpty(filterByStatus)) andConditions.push(filterByStatus)
    if (!isEmpty(filterByCreator)) andConditions.push(filterByCreator)

    const andFilter: FilterQuery<IRequestDocument> = isEmpty(andConditions)
      ? {}
      : { $and: andConditions }

    const filterToApply: FilterQuery<IRequestDocument> = { ...andFilter }

    return this.request.find(filterToApply).exec()
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
      throw isNotFoundDatabaseError(error) ? notFoundError() : error
    }
  }

  public deleteOne: IRequestRepository['deleteOne'] = async (filter) => {
    try {
      const { id, entityId }: typeof filter = omitUndefined(filter)

      const filterById: FilterQuery<IRequestDocument> = id ? { _id: id } : {}

      const filterByEntity: FilterQuery<IRequestDocument> = entityId
        ? { entity: entityId }
        : {}

      const filterToApply: FilterQuery<IRequestDocument> = {
        ...filterById,
        ...filterByEntity,
      }

      const request = await this.request
        .findOneAndDelete(filterToApply)
        .orFail()
        .populate('entity')
        .exec()

      return request
    } catch (error) {
      throw isNotFoundDatabaseError(error) ? notFoundError() : error
    }
  }

  public deleteMany: IRequestRepository['deleteMany'] = async (filter) => {
    try {
      const { entityIds }: typeof filter = omitUndefined(filter)

      const filterByEntity: FilterQuery<IRequestDocument> = isEmpty(entityIds)
        ? {}
        : { entity: { $in: entityIds } }

      const filterToApply: FilterQuery<IRequestDocument> = { ...filterByEntity }

      if (isEmpty(filterToApply)) {
        throw badRequestError(null, {
          kind: ErrorKindsEnum.EmptyFilter,
        })
      }

      await this.request.deleteMany(filterToApply)
    } catch (error) {
      throw isBadRequestError(error) ? error : serverError()
    }
  }
}

export default new RequestRepository()
