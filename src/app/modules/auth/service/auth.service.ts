import pick from 'lodash/pick'
import { singleton } from 'tsyringe'

import logger from 'lib/logger'
import { IAuthService } from 'modules/auth/service'
import { SessionService } from 'modules/session/service'
import { IUserDocument } from 'modules/user/model'
import { UserService } from 'modules/user/service'
import { VALIDATION_ERR_MSG } from 'shared/constants/errorMessages'
import {
  UnknownError as AppUnknownError,
  ValidationError as AppValidationError,
  isNotFoundError as isAppNotFoundError,
  isValidationError as isAppValidationError,
} from 'shared/utils/errors/appErrors'

@singleton()
class AuthService implements IAuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  public signin: IAuthService['signin'] = async (payload) => {
    let user: IUserDocument
    const { email, password } = payload
    const unknownErrorMsg = 'Sign in error'

    try {
      user = await this.userService.getOneByEmail(email)

      const isCorrectPassword = await user.checkPassword(password)

      if (!isCorrectPassword) {
        throw new AppValidationError(VALIDATION_ERR_MSG, {
          password: ['Wrong password'],
        })
      }
    } catch (error: any) {
      if (isAppNotFoundError(error) || isAppValidationError(error)) {
        throw error
      }

      logger.error(error.stack)
      throw new AppUnknownError(unknownErrorMsg)
    }

    try {
      const session = await this.sessionService.createOne({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      const signinResult = {
        ...pick(user, 'id', 'role'),
        ...pick(session, 'token'),
      }

      return signinResult
    } catch (error: any) {
      logger.error(error.stack)
      throw new AppUnknownError(unknownErrorMsg)
    }
  }

  public signup: IAuthService['signup'] = async (payload) => {
    let user: IUserDocument
    const unknownErrorMsg = 'Sign up error'

    try {
      user = await this.userService.createOne(payload)
    } catch (error: any) {
      if (isAppValidationError(error)) {
        throw error
      }

      logger.error(error.stack)
      throw new AppUnknownError(unknownErrorMsg)
    }

    try {
      const session = await this.sessionService.createOne({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      const signupResult = {
        ...pick(user, 'id', 'role'),
        ...pick(session, 'token'),
      }

      return signupResult
    } catch (error: any) {
      logger.error(error.stack)

      try {
        await this.userService.deleteOneById(user.id)
      } catch (error: any) {
        logger.warn(error.stack, {
          message: `User with id "${user.id}" probably was not deleted`,
        })
      }

      throw new AppUnknownError(unknownErrorMsg)
    }
  }

  public logout: IAuthService['logout'] = async (token) => {
    try {
      await this.sessionService.deleteOneByToken(token)
    } catch (error: any) {
      if (isAppNotFoundError(error)) {
        throw error
      }

      logger.error(error.stack)
      throw new AppUnknownError('Error while logging out')
    }
  }
}

export default AuthService
