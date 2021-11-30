import { delay, inject, singleton } from 'tsyringe'

import { VALIDATION_ERR_MSG } from 'app/constants/messages/errors'
import {
  isDatabaseNotFoundError,
  isDatabaseValidationError,
} from 'database/errors'
import logger from 'lib/logger'
import { SessionRepository } from 'modules/session/repository'
import { ISessionService } from 'modules/session/service'
import {
  AppNotFoundError,
  AppUnknownError,
  AppValidationError,
} from 'app/utils/errors/appErrors'

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
      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError('Session was not found')
      }

      logger.error(error.stack)
      throw new AppUnknownError(error.message)
    }
  }

  public createOne: ISessionService['createOne'] = async (payload) => {
    try {
      const session = await this.sessionRepository.createOne({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      })

      return session
    } catch (error: any) {
      if (isDatabaseValidationError(error)) {
        throw new AppValidationError(VALIDATION_ERR_MSG, error.errors)
      }

      logger.error(error.stack)
      throw new AppUnknownError(error.message)
    }
  }

  public deleteOneByToken: ISessionService['deleteOneByToken'] = async (
    token,
  ) => {
    try {
      const session = await this.sessionRepository.deleteOne({ token })
      return session
    } catch (error: any) {
      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError('Session was not found')
      }

      logger.error(error.stack)
      throw new AppUnknownError(error.message)
    }
  }
}

export default SessionService
