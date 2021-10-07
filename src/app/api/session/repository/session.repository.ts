import { ISessionModel, SessionModel } from 'api/session/model'
import { ISessionRepository } from 'api/session/repository'

class SessionRepository implements ISessionRepository {
  private readonly session: ISessionModel

  public constructor() {
    this.session = SessionModel
  }

  public create: ISessionRepository['create'] = async (payload) => {
    const token = this.session.generateToken(payload)
    const session = new this.session({
      token,
      user: payload.userId,
    })

    return session.save()
  }

  public findOneByToken: ISessionRepository['findOneByToken'] = async (
    token,
  ) => {
    return this.session.findOne({ token }).exec()
  }

  public deleteOneByToken: ISessionRepository['deleteOneByToken'] = async (
    token,
  ) => {
    await this.session.findOneAndDelete({ token }).orFail()
  }
}

export default new SessionRepository()
