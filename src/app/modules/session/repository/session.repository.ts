import { ISessionModel, SessionModel } from 'modules/session/model'
import { ISessionRepository } from 'modules/session/repository'

class SessionRepository implements ISessionRepository {
  private readonly session: ISessionModel

  public constructor() {
    this.session = SessionModel
  }

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

export default new SessionRepository()
