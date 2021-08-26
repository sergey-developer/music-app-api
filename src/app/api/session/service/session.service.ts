import { ISessionRepository, SessionRepository } from 'api/session/repository'
import { ISessionService } from 'api/session/service'

class SessionService implements ISessionService {
  private readonly sessionRepository: ISessionRepository

  public constructor() {
    this.sessionRepository = SessionRepository
  }

  public create: ISessionService['create'] = async (payload) => {
    try {
      const session = await this.sessionRepository.create(payload)
      return session
    } catch (error) {
      throw error
      // TODO: handle error
    }
  }
}

export default new SessionService()
