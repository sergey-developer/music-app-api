import isEmpty from 'lodash/isEmpty'
import { FilterQuery } from 'mongoose'

import {
  IRequestDocument,
  IRequestModel,
  RequestModel,
} from 'modules/request/model'
import { IRequestRepository } from 'modules/request/repository'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { omitUndefined } from 'shared/utils/common'
import { BadRequestError } from 'shared/utils/errors/httpErrors'

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

    const filterToApply: FilterQuery<IRequestDocument> = {
      ...filterByEntityName,
      ...filterByStatus,
      ...filterByCreator,
    }

    return this.request.find(filterToApply).exec()
  }

  public createOne: IRequestRepository['createOne'] = async (payload) => {
    const request = new this.request(payload)
    return request.save()
  }

  public findOneById: IRequestRepository['findOneById'] = async (id) => {
    return this.request.findById(id).orFail().exec()
  }

  public deleteOne: IRequestRepository['deleteOne'] = async (filter) => {
    const { id, entityId }: typeof filter = omitUndefined(filter)

    const filterById: FilterQuery<IRequestDocument> = id ? { _id: id } : {}

    const filterByEntity: FilterQuery<IRequestDocument> = entityId
      ? { entity: entityId }
      : {}

    const filterToApply: FilterQuery<IRequestDocument> = {
      ...filterById,
      ...filterByEntity,
    }

    return this.request
      .findOneAndDelete(filterToApply)
      .orFail()
      .populate('entity')
      .exec()
  }

  public deleteMany: IRequestRepository['deleteMany'] = async (filter) => {
    const { entityIds }: typeof filter = omitUndefined(filter)

    const filterByEntity: FilterQuery<IRequestDocument> = isEmpty(entityIds)
      ? {}
      : { entity: { $in: entityIds } }

    const filterToApply: FilterQuery<IRequestDocument> = { ...filterByEntity }

    if (isEmpty(filterToApply)) {
      throw BadRequestError(null, {
        kind: ErrorKindsEnum.EmptyFilter,
      })
    }

    await this.request.deleteMany(filterToApply)
  }
}

export default new RequestRepository()
