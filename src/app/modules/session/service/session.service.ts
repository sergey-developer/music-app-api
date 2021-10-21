import { isNotFoundDBError } from 'database/utils/errors'
import logger from 'lib/logger'
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

      logger.error(error.stack)
      throw ServerError()
    }
  }

  public createOne: ISessionService['createOne'] = async (payload) => {
    try {
      const session = await this.sessionRepository.createOne({
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

      logger.error(error.stack)
      throw ServerError()
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

      logger.error(error.stack)
      throw ServerError()
    }
  }
}

export default new SessionService()
