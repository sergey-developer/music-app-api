import { FilterQuery } from 'mongoose'
import { singleton } from 'tsyringe'

import { IUserDocument, IUserModel, UserModel } from 'modules/user/model'
import { IUserRepository } from 'modules/user/repository'
import { omitUndefined } from 'shared/utils/common'

@singleton()
class UserRepository implements IUserRepository {
  private readonly user: IUserModel

  public constructor() {
    this.user = UserModel
  }

  public findOne: IUserRepository['findOne'] = async (filter) => {
    const { email }: typeof filter = omitUndefined(filter)

    const filterByEmail: FilterQuery<IUserDocument> = email ? { email } : {}
    const filterToApply: FilterQuery<IUserDocument> = { ...filterByEmail }

    return this.user.findOne(filterToApply).orFail().exec()
  }

  public createOne: IUserRepository['createOne'] = async (payload) => {
    const user = new this.user(payload)
    return user.save()
  }

  public deleteOneById: IUserRepository['deleteOneById'] = async (id) => {
    return this.user.findByIdAndDelete(id).orFail().exec()
  }
}

export default UserRepository
