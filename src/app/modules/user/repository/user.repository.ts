import { FilterQuery } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import { EntityNamesEnum } from 'database/constants/entityNames'
import getModelName from 'database/utils/getModelName'
import { IUserDocument, IUserModel } from 'modules/user/model'
import { IUserRepository } from 'modules/user/repository'
import { omitUndefined } from 'shared/utils/common'

@singleton()
class UserRepository implements IUserRepository {
  public constructor(
    @inject(getModelName(EntityNamesEnum.User))
    private readonly user: IUserModel,
  ) {}

  public findOne: IUserRepository['findOne'] = async (filter) => {
    const { email } = omitUndefined(filter)

    const filterByEmail: FilterQuery<IUserDocument> = email ? { email } : {}
    const filterToApply: FilterQuery<IUserDocument> = { ...filterByEmail }

    return this.user.findOne(filterToApply).orFail().exec()
  }

  public createOne: IUserRepository['createOne'] = async (payload) => {
    const payloadToApply = omitUndefined(payload)
    const user = new this.user(payloadToApply)
    return user.save()
  }

  public deleteOne: IUserRepository['deleteOne'] = async (filter) => {
    const { id } = omitUndefined(filter)

    const filterById: FilterQuery<IUserDocument> = id ? { _id: id } : {}
    const filterToApply: FilterQuery<IUserDocument> = { ...filterById }

    return this.user.findOneAndDelete(filterToApply).orFail().exec()
  }
}

export default UserRepository
