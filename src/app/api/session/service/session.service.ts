import { ISessionRepository, SessionRepository } from 'api/session/repository'
import { ISessionService } from 'api/session/service'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import {
  badRequestError,
  isNotFoundError,
  notFoundError,
  serverError,
  unauthorizedError,
} from 'shared/utils/errors/httpErrors'

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
      if (isValidationError(error.name)) {
        throw badRequestError(error.message, {
          kind: error.name,
          errors: error.errors,
        })
      }

      throw serverError('Error while creating new session')
    }
  }

  public getOneByToken: ISessionRepository['findOneByToken'] = async (
    token,
  ) => {
    try {
      const session = await this.sessionRepository.findOneByToken(token)
      return session
    } catch (error) {
      if (isNotFoundError(error)) {
        throw unauthorizedError(`Session with token "${token}" was not found`)
      }

      throw serverError(`Error while getting session by token "${token}"`)
    }
  }

  public deleteOneByToken: ISessionRepository['deleteOneByToken'] = async (
    token,
  ) => {
    try {
      await this.sessionRepository.deleteOneByToken(token)
    } catch (error) {
      if (isNotFoundError(error)) {
        throw notFoundError(`Session with token "${token}" was not found`)
      }

      throw serverError(`Error while deleting session by token "${token}"`)
    }
  }
}

export default new SessionService()
