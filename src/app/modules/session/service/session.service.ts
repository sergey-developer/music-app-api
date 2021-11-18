import { delay, inject, singleton } from 'tsyringe'

import DatabaseError from 'database/errors'
import logger from 'lib/logger'
import { SessionRepository } from 'modules/session/repository'
import { ISessionService } from 'modules/session/service'
import { VALIDATION_ERR_MSG } from 'shared/constants/errorMessages'
import AppError from 'shared/utils/errors/appErrors'

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
      if (error instanceof DatabaseError.NotFoundError) {
        throw new AppError.NotFoundError('Session was not found')
      }

      logger.error(error.stack)
      throw new AppError.UnknownError(error.message)
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
      if (error instanceof DatabaseError.ValidationError) {
        throw new AppError.ValidationError(VALIDATION_ERR_MSG, error.errors)
      }

      logger.error(error.stack)
      throw new AppError.UnknownError(error.message)
    }
  }

  public deleteOneByToken: ISessionService['deleteOneByToken'] = async (
    token,
  ) => {
    try {
      const session = await this.sessionRepository.deleteOne({ token })
      return session
    } catch (error: any) {
      if (error instanceof DatabaseError.NotFoundError) {
        throw new AppError.NotFoundError('Session was not found')
      }

      logger.error(error.stack)
      throw new AppError.UnknownError(error.message)
    }
  }
}

export default SessionService
