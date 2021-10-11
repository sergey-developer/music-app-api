import { FilterQuery } from 'mongoose'

import { IUserDocument, IUserModel, UserModel } from 'modules/user/model'
import { IUserRepository } from 'modules/user/repository'
import { omitUndefined } from 'shared/utils/common'

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
    const { email }: typeof filter = omitUndefined(filter)

    const filterByEmail: FilterQuery<IUserDocument> = email ? { email } : {}
    const filterToApply: FilterQuery<IUserDocument> = { ...filterByEmail }

    return this.user.findOne(filterToApply).orFail().exec()
  }

  public deleteOneById: IUserRepository['deleteOneById'] = async (id) => {
    return this.user.findByIdAndDelete(id).orFail().exec()
  }
}

export default new UserRepository()
