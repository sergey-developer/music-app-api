import { delay, inject, singleton } from 'tsyringe'

import { isNotFoundDBError } from 'database/utils/errors'
import logger from 'lib/logger'
import { SessionRepository } from 'modules/session/repository'
import { ISessionService } from 'modules/session/service'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import { NotFoundError, ServerError } from 'shared/utils/errors/httpErrors'
import { ValidationError } from 'shared/utils/errors/validationErrors'

@singleton()
class SessionService implements ISessionService {
  public constructor(
    @inject(delay(() => SessionRepository))
    private readonly sessionRepository: SessionRepository,
  ) {}

  public getOneByToken: ISessionService['getOneByToken'] = async (token) => {
    try {
      const session = await this.sessionRepository.findOne({ token })
      return session
    } catch (error: any) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError()
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
    } catch (error: any) {
      if (isValidationError(error.name)) {
        throw ValidationError(null, error)
      }

      logger.error(error.stack)
      throw ServerError()
    }
  }

  public deleteOneByToken: ISessionService['deleteOneByToken'] = async (
    token,
  ) => {
    try {
      const session = await this.sessionRepository.deleteOne({ token })
      return session
    } catch (error: any) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError()
      }

      logger.error(error.stack)
      throw ServerError()
    }
  }
}

export default SessionService
