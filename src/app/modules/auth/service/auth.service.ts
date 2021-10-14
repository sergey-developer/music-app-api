import pick from 'lodash/pick'

import logger from 'lib/logger'
import { IAuthService } from 'modules/auth/service'
import { ISessionService, SessionService } from 'modules/session/service'
import { IUserDocument } from 'modules/user/model'
import { IUserService, UserService } from 'modules/user/service'
import {
  BadRequestError,
  ServerError,
  isBadRequestError,
  isNotFoundError,
} from 'shared/utils/errors/httpErrors'

class AuthService implements IAuthService {
  private readonly userService: IUserService
  private readonly sessionService: ISessionService

  public constructor() {
    this.userService = UserService
    this.sessionService = SessionService
  }

  public signin: IAuthService['signin'] = async (payload) => {
    let user: IUserDocument
    const serverErrorMsg = 'Something went wrong. Sign in error.'

    try {
      const { email, password } = payload

      user = await this.userService.getOneByEmail(email)

      const isCorrectPassword = await user.checkPassword(password)

      if (!isCorrectPassword) {
        throw BadRequestError('Wrong password')
      }
    } catch (error) {
      if (isNotFoundError(error) || isBadRequestError(error)) {
        throw error
      }

      logger.error(error.stack)
      throw ServerError(serverErrorMsg)
    }

    try {
      const session = await this.sessionService.create({
        id: user.id,
        email: user.email,
        role: user.role,
      })

      const signinResult = {
        ...pick(user, 'id', 'role'),
        ...pick(session, 'token'),
      }

      return signinResult
    } catch (error) {
      logger.error(error.stack)
      throw ServerError(serverErrorMsg)
    }
  }

  public signup: IAuthService['signup'] = async (payload) => {
    let user: IUserDocument
    const serverErrorMsg = 'Something went wrong. Sign up error.'

    try {
      user = await this.userService.create(payload)
    } catch (error) {
      if (isBadRequestError(error)) {
        throw error
      }

      logger.error(error.stack)
      throw ServerError(serverErrorMsg)
    }

    try {
      const session = await this.sessionService.create({
        id: user.id,
        email: user.email,
        role: user.role,
      })

      const signupResult = {
        ...pick(user, 'id', 'role'),
        ...pick(session, 'token'),
      }

      return signupResult
    } catch (error) {
      logger.error(error.stack)

      try {
        await this.userService.deleteOneById(user.id)
      } catch (error) {
        logger.warn(error.stack, {
          message: `User with id "${user.id}" was not deleted`,
        })
      }

      throw ServerError(serverErrorMsg)
    }
  }
}

export default new AuthService()
