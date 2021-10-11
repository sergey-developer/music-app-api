import { isNotFoundDBError } from 'database/utils/errors'
import {
  ISessionRepository,
  SessionRepository,
} from 'modules/session/repository'
import { ISessionService } from 'modules/session/service'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
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
        throw BadRequestError(error.message, {
          kind: error.name,
          errors: error.errors,
        })
      }

      throw ServerError('Error while creating new session')
    }
  }

  public getOneByToken: ISessionRepository['findOneByToken'] = async (
    token,
  ) => {
    try {
      const session = await this.sessionRepository.findOneByToken(token)
      return session
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw UnauthorizedError(`Session with token "${token}" was not found`)
      }

      throw ServerError(`Error while getting session by token "${token}"`)
    }
  }

  public deleteOneByToken: ISessionRepository['deleteOneByToken'] = async (
    token,
  ) => {
    try {
      await this.sessionRepository.deleteOneByToken(token)
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError(`Session with token "${token}" was not found`)
      }

      throw ServerError(`Error while deleting session by token "${token}"`)
    }
  }
}

export default new SessionService()
