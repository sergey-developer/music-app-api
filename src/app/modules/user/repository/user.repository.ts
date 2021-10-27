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
