import { inject, singleton } from 'tsyringe'

import { EntityNamesEnum } from 'database/constants/entityNames'
import getModelName from 'database/utils/getModelName'
import { ISessionModel } from 'modules/session/model'
import { ISessionRepository } from 'modules/session/repository'

@singleton()
class SessionRepository implements ISessionRepository {
  public constructor(
    @inject(getModelName(EntityNamesEnum.Session))
    private readonly session: ISessionModel,
  ) {}

  public findOneByToken: ISessionRepository['findOneByToken'] = async (
    token,
  ) => {
    return this.session.findOne({ token }).orFail().exec()
  }

  public createOne: ISessionRepository['createOne'] = async (payload) => {
    const token = this.session.generateToken(payload)
    const session = new this.session({
      token,
      user: payload.userId,
    })

    return session.save()
  }

  public deleteOneByToken: ISessionRepository['deleteOneByToken'] = async (
    token,
  ) => {
    return this.session.findOneAndDelete({ token }).orFail().exec()
  }
}

export default SessionRepository
