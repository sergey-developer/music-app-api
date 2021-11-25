import { FilterQuery, Error as MongooseError } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import EntityNamesEnum from 'database/constants/entityNamesEnum'
import {
  DatabaseNotFoundError,
  DatabaseUnknownError,
  DatabaseValidationError,
} from 'database/errors'
import getModelName from 'database/utils/getModelName'
import { IUserDocument, IUserModel } from 'modules/user/model'
import { IUserRepository } from 'modules/user/repository'
import { omitUndefined } from 'shared/utils/common'
import { getValidationErrors } from 'shared/utils/errors/validationErrors'

@singleton()
class UserRepository implements IUserRepository {
  public constructor(
    @inject(getModelName(EntityNamesEnum.User))
    private readonly user: IUserModel,
  ) {}

  public findOne: IUserRepository['findOne'] = async (filter) => {
    try {
      const { email } = omitUndefined(filter)

      const filterByEmail: FilterQuery<IUserDocument> = email ? { email } : {}
      const filterToApply: FilterQuery<IUserDocument> = { ...filterByEmail }

      return this.user.findOne(filterToApply).orFail().exec()
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseNotFoundError(error.message)
      }

      throw new DatabaseUnknownError(error.message)
    }
  }

  public createOne: IUserRepository['createOne'] = async (payload) => {
    try {
      const payloadToApply = omitUndefined(payload)
      const user = new this.user(payloadToApply)
      return user.save()
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

  public deleteOne: IUserRepository['deleteOne'] = async (filter) => {
    try {
      const { id } = omitUndefined(filter)

      const filterById: FilterQuery<IUserDocument> = id ? { _id: id } : {}
      const filterToApply: FilterQuery<IUserDocument> = { ...filterById }

      return this.user.findOneAndDelete(filterToApply).orFail().exec()
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseNotFoundError(error.message)
      }

      throw new DatabaseUnknownError(error.message)
    }
  }
}

export default UserRepository
