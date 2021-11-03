import pick from 'lodash/pick'
import { singleton } from 'tsyringe'

import logger from 'lib/logger'
import { IAuthService } from 'modules/auth/service'
import { SessionService } from 'modules/session/service'
import { IUserDocument } from 'modules/user/model'
import { UserService } from 'modules/user/service'
import {
  BadRequestError,
  ServerError,
  isBadRequestError,
  isNotFoundError,
} from 'shared/utils/errors/httpErrors'

@singleton()
class AuthService implements IAuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  public signin: IAuthService['signin'] = async (payload) => {
    let user: IUserDocument
    const serverErrorMsg = 'Sign in error'

    try {
      const { email, password } = payload

      user = await this.userService.getOneByEmail(email)

      const isCorrectPassword = await user.checkPassword(password)

      if (!isCorrectPassword) {
        throw BadRequestError('Wrong password')
      }
    } catch (error: any) {
      if (isNotFoundError(error) || isBadRequestError(error)) {
        throw error
      }

      logger.error(error.stack)
      throw ServerError(serverErrorMsg)
    }

    try {
      const session = await this.sessionService.createOne({
        id: user.id,
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
      throw ServerError(serverErrorMsg)
    }
  }

  public signup: IAuthService['signup'] = async (payload) => {
    let user: IUserDocument
    const serverErrorMsg = 'Sign up error'

    try {
      user = await this.userService.createOne(payload)
    } catch (error: any) {
      if (isBadRequestError(error)) {
        throw error
      }

      logger.error(error.stack)
      throw ServerError(serverErrorMsg)
    }

    try {
      const session = await this.sessionService.createOne({
        id: user.id,
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

      throw ServerError(serverErrorMsg)
    }
  }

  public logout: IAuthService['logout'] = async (token) => {
    try {
      await this.sessionService.deleteOneByToken(token)
    } catch (error: any) {
      if (isNotFoundError(error)) {
        throw error
      }

      logger.error(error.stack)
      throw ServerError('Error while logging out')
    }
  }
}

export default AuthService
