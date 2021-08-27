import { ISessionRepository, SessionRepository } from 'api/session/repository'
import { ISessionService } from 'api/session/service'

class SessionService implements ISessionService {
  private readonly sessionRepository: ISessionRepository

  public constructor() {
    this.sessionRepository = SessionRepository
  }

  public create: ISessionService['create'] = async (payload) => {
    try {
      const session = await this.sessionRepository.create({
        userId: payload.id,
        email: payload.email,
        role: payload.role,
      })

      return session
    } catch (error) {
      throw error
      // TODO: handle error
    }
  }

  public getOneByToken: ISessionRepository['findOneByToken'] = async (
    token,
  ) => {
    try {
      const session = await this.sessionRepository.findOneByToken(token)
      return session
    } catch (error) {
      throw error
      // TODO: handle error
    }
  }

  public deleteOneByToken: ISessionRepository['deleteOneByToken'] = async (
    token,
  ) => {
    try {
      await this.sessionRepository.deleteOneByToken(token)
    } catch (error) {
      throw error
      // TODO: handle error
    }
  }
}

export default new SessionService()
