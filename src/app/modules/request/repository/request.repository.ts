import isEmpty from 'lodash/isEmpty'
import { FilterQuery, QueryOptions } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import { EntityNamesEnum } from 'database/constants/entityNames'
import getModelName from 'database/utils/getModelName'
import { IRequestDocument, IRequestModel } from 'modules/request/model'
import { IRequestRepository } from 'modules/request/repository'
import { omitUndefined } from 'shared/utils/common'

@singleton()
class RequestRepository implements IRequestRepository {
  public constructor(
    @inject(getModelName(EntityNamesEnum.Request))
    private readonly request: IRequestModel,
  ) {}

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

  public findOneById: IRequestRepository['findOneById'] = async (id) => {
    return this.request.findById(id).orFail().exec()
  }

  public createOne: IRequestRepository['createOne'] = async (payload) => {
    const request = new this.request(payload)
    return request.save()
  }

  public updateOne: IRequestRepository['updateOne'] = async (
    filter,
    payload,
  ) => {
    const { id } = omitUndefined(filter)
    const updates = omitUndefined(payload)

    const defaultOptions: QueryOptions = { runValidators: true, new: true }
    const optionsToApply: QueryOptions = defaultOptions

    const filterById: FilterQuery<IRequestDocument> = id ? { _id: id } : {}
    const filterToApply: FilterQuery<IRequestDocument> = { ...filterById }

    return this.request
      .findOneAndUpdate(filterToApply, updates, optionsToApply)
      .orFail()
      .exec()
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

    await this.request.deleteMany(filterToApply)
  }
}

export default RequestRepository
