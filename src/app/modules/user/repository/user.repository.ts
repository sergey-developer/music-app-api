import { FilterQuery, Error as MongooseError } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import { omitUndefined } from 'app/utils/common'
import { EntityNamesEnum } from 'database/constants'
import {
  DatabaseNotFoundError,
  DatabaseUnknownError,
  DatabaseValidationError,
} from 'database/errors'
import { IUserDocument, IUserModel } from 'database/models/user'
import { getValidationErrors } from 'database/utils/errors'
import getModelName from 'database/utils/getModelName'
import { IUserRepository } from 'modules/user/repository'

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

      const user = await this.user.findOne(filterToApply).orFail().exec()
      return user
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
      const newUser = new this.user(payloadToApply)

      const user = await newUser.save()
      return user
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

      const user = await this.user
        .findOneAndDelete(filterToApply)
        .orFail()
        .exec()

      return user
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseNotFoundError(error.message)
      }

      throw new DatabaseUnknownError(error.message)
    }
  }
}

export default UserRepository
