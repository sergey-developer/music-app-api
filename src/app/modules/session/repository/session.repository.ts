import { FilterQuery } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import { EntityNamesEnum } from 'database/constants/entityNames'
import getModelName from 'database/utils/getModelName'
import { ISessionModel } from 'modules/session/model'
import { ISessionRepository } from 'modules/session/repository'
import { IUserDocument } from 'modules/user/model'
import { omitUndefined } from 'shared/utils/common'

@singleton()
class SessionRepository implements ISessionRepository {
  public constructor(
    @inject(getModelName(EntityNamesEnum.Session))
    private readonly session: ISessionModel,
  ) {}

  public findOne: ISessionRepository['findOne'] = async (filter) => {
    const { token } = omitUndefined(filter)

    const filterByToken: FilterQuery<IUserDocument> = token ? { token } : {}
    const filterToApply: FilterQuery<IUserDocument> = { ...filterByToken }

    return this.session.findOne(filterToApply).orFail().exec()
  }

  public createOne: ISessionRepository['createOne'] = async (payload) => {
    const token = this.session.generateToken(payload)
    const session = new this.session({
      token,
      user: payload.userId,
    })

    return session.save()
  }

  public deleteOne: ISessionRepository['deleteOne'] = async (filter) => {
    const { token } = omitUndefined(filter)

    const filterByToken: FilterQuery<IUserDocument> = token ? { token } : {}
    const filterToApply: FilterQuery<IUserDocument> = { ...filterByToken }

    return this.session.findOneAndDelete(filterToApply).orFail().exec()
  }
}

export default SessionRepository
