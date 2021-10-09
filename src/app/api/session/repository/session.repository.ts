import { ISessionModel, SessionModel } from 'api/session/model'
import { ISessionRepository } from 'api/session/repository'
import { isNotFoundDatabaseError } from 'database/utils/errors'
import { notFoundError } from 'shared/utils/errors/httpErrors'

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
    try {
      const session = await this.session.findOne({ token }).orFail().exec()
      return session
    } catch (error) {
      throw isNotFoundDatabaseError(error) ? notFoundError() : error
    }
  }

  public deleteOneByToken: ISessionRepository['deleteOneByToken'] = async (
    token,
  ) => {
    try {
      await this.session.findOneAndDelete({ token }).orFail()
    } catch (error) {
      throw isNotFoundDatabaseError(error) ? notFoundError() : error
    }
  }
}

export default new SessionRepository()
