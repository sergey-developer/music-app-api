import { FilterQuery } from 'mongoose'

import { IUserDocument, IUserModel, UserModel } from 'api/user/model'
import { IUserRepository } from 'api/user/repository'
import { isNotFoundDatabaseError } from 'database/utils/errors'
import { omitUndefined } from 'shared/utils/common'
import { notFoundError } from 'shared/utils/errors/httpErrors'

class UserRepository implements IUserRepository {
  private readonly user: IUserModel

  public constructor() {
    this.user = UserModel
  }

  public create: IUserRepository['create'] = async (payload) => {
    const user = new this.user(payload)
    return user.save()
  }

  public findOne: IUserRepository['findOne'] = async (filter) => {
    try {
      const { email }: typeof filter = omitUndefined(filter)

      const filterByEmail: FilterQuery<IUserDocument> = email ? { email } : {}
      const filterToApply: FilterQuery<IUserDocument> = { ...filterByEmail }

      const user = await this.user.findOne(filterToApply).orFail().exec()
      return user
    } catch (error) {
      throw isNotFoundDatabaseError(error) ? notFoundError() : error
    }
  }
}

export default new UserRepository()
