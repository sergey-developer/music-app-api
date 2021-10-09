import { StatusCodes } from 'http-status-codes'
import merge from 'lodash/merge'
import pick from 'lodash/pick'

import { IAuthController } from 'api/auth/controller'
import { ISessionService, SessionService } from 'api/session/service'
import { IUserService, UserService } from 'api/user/service'
import {
  badRequestError,
  ensureHttpError,
} from 'shared/utils/errors/httpErrors'

class AuthController implements IAuthController {
  private readonly userService: IUserService
  private readonly sessionService: ISessionService

  public constructor() {
    this.userService = UserService
    this.sessionService = SessionService
  }

  public signup: IAuthController['signup'] = async (req, res) => {
    try {
      const { email, username, password } = req.body

      const user = await this.userService.create({
        email,
        username,
        password,
      })
      const session = await this.sessionService.create(user)

      const result = merge(pick(user, 'id', 'role'), pick(session, 'token'))

      res.status(StatusCodes.OK).send(result)
    } catch (exception) {
      // TODO: если ошибки при создании сессии то удалять созданного пользователя
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public signin: IAuthController['signin'] = async (req, res) => {
    try {
      const { email, password } = req.body

      const user = await this.userService.getOneByEmail(email)

      const isCorrectPassword = await user.checkPassword(password)

      if (!isCorrectPassword) throw badRequestError('Wrong password')

      const session = await this.sessionService.create(user)

      const result = merge(pick(user, 'id', 'role'), pick(session, 'token'))

      res.status(StatusCodes.OK).send(result)
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default new AuthController()
