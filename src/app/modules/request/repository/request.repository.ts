import isEmpty from 'lodash/isEmpty'
import { FilterQuery, Error as MongooseError, QueryOptions } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import { omitUndefined } from 'app/utils/common'
import { EntityNamesEnum } from 'database/constants'
import {
  DatabaseNotFoundError,
  DatabaseUnknownError,
  DatabaseValidationError,
} from 'database/errors'
import { IRequestDocument, IRequestModel } from 'database/models/request'
import { getValidationErrors } from 'database/utils/errors'
import getModelName from 'database/utils/getModelName'
import { IRequestRepository } from 'modules/request/repository'

@singleton()
class RequestRepository implements IRequestRepository {
  public constructor(
    @inject(getModelName(EntityNamesEnum.Request))
    private readonly request: IRequestModel,
  ) {}

  public findAll: IRequestRepository['findAll'] = async () => {
    try {
      const requests = await this.request.find().exec()
      return requests
    } catch (error: any) {
      throw new DatabaseUnknownError(error.message)
    }
  }

  public findAllWhere: IRequestRepository['findAllWhere'] = async (filter) => {
    try {
      const { status, creator, kind } = omitUndefined(filter)

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

      const requests = await this.request.find(filterToApply).exec()
      return requests
    } catch (error: any) {
      throw new DatabaseUnknownError(error.message)
    }
  }

  public findOne: IRequestRepository['findOne'] = async (filter) => {
    try {
      const { id, entity } = omitUndefined(filter)

      const filterById: FilterQuery<IRequestDocument> = id ? { _id: id } : {}
      const filterByEntity: FilterQuery<IRequestDocument> = entity
        ? { entity }
        : {}

      const filterToApply: FilterQuery<IRequestDocument> = {
        ...filterById,
        ...filterByEntity,
      }

      const request = await this.request.findOne(filterToApply).orFail().exec()
      return request
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseNotFoundError(error.message)
      }

      throw new DatabaseUnknownError(error.message)
    }
  }

  public createOne: IRequestRepository['createOne'] = async (payload) => {
    try {
      const newRequest = new this.request(payload)
      const request = await newRequest.save()
      return request
    } catch (error: any) {
      if (error instanceof MongooseError.ValidationError) {
        throw new DatabaseValidationError(
          error.message,
          getValidationErrors(
            error.errors as Record<string, MongooseError.ValidatorError>,
          ),
        )
      }

      throw new DatabaseUnknownError(error.message)
    }
  }

  public updateOne: IRequestRepository['updateOne'] = async (
    filter,
    payload,
  ) => {
    try {
      const { id } = omitUndefined(filter)
      const updates = omitUndefined(payload)

      const defaultOptions: QueryOptions = {
        runValidators: true,
        new: true,
        context: 'query',
      }
      const optionsToApply: QueryOptions = defaultOptions

      const filterById: FilterQuery<IRequestDocument> = id ? { _id: id } : {}
      const filterToApply: FilterQuery<IRequestDocument> = { ...filterById }

      const request = await this.request
        .findOneAndUpdate(filterToApply, updates, optionsToApply)
        .orFail()
        .exec()

      return request
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseNotFoundError(error.message)
      }

      if (error instanceof MongooseError.ValidationError) {
        throw new DatabaseValidationError(
          error.message,
          getValidationErrors(
            error.errors as Record<string, MongooseError.ValidatorError>,
          ),
        )
      }

      throw new DatabaseUnknownError(error.message)
    }
  }

  public deleteOne: IRequestRepository['deleteOne'] = async (filter) => {
    try {
      const { id, entityId } = omitUndefined(filter)

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
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseNotFoundError(error.message)
      }

      throw new DatabaseUnknownError(error.message)
    }
  }

  public deleteMany: IRequestRepository['deleteMany'] = async (filter) => {
    try {
      const { entityIds } = omitUndefined(filter)

      const filterByEntity: FilterQuery<IRequestDocument> = isEmpty(entityIds)
        ? {}
        : { entity: { $in: entityIds } }

      const filterToApply: FilterQuery<IRequestDocument> = { ...filterByEntity }

      const deletionResult = await this.request.deleteMany(filterToApply).exec()
      return deletionResult
    } catch (error: any) {
      throw new DatabaseUnknownError(error.message)
    }
  }
}

export default RequestRepository
