import { SessionModel } from 'api/session/model'
import { ISessionRepository } from 'api/session/repository'

class SessionRepository implements ISessionRepository {
  private readonly session: typeof SessionModel

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
}

export default new SessionRepository()
