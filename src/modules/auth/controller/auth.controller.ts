import { StatusCodes } from 'http-status-codes'
import merge from 'lodash/merge'
import pick from 'lodash/pick'

import { IAuthController } from 'modules/auth/controller'
import { ISessionService, SessionService } from 'modules/session/service'
import { IUserDocument } from 'modules/user/model'
import { IUserService, UserService } from 'modules/user/service'
import {
  badRequestError,
  ensureHttpError,
  serverError,
} from 'shared/utils/errors/httpErrors'

class AuthController implements IAuthController {
  private readonly userService: IUserService
  private readonly sessionService: ISessionService

  public constructor() {
    this.userService = UserService
    this.sessionService = SessionService
  }

  public signup: IAuthController['signup'] = async (req, res) => {
    let user: IUserDocument

    try {
      const { email, username, password } = req.body

      user = await this.userService.create({
        email,
        username,
        password,
      })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
      return
    }

    try {
      const session = await this.sessionService.create({
        id: user.id,
        email: user.email,
        role: user.role,
      })

      const result = merge(pick(user, 'id', 'role'), pick(session, 'token'))

      res.status(StatusCodes.OK).send(result)
      return
    } catch (exception) {
      const error = serverError('Error while creating new user')

      try {
        await this.userService.deleteOneById(user.id)
        res.status(error.status).send(error)
        return
      } catch (exception) {
        console.log(`User with id "${user.id}" was not deleted`)
        res.status(error.status).send(error)
        return
      }
    }
  }

  public signin: IAuthController['signin'] = async (req, res) => {
    let user: IUserDocument

    try {
      const { email, password } = req.body

      user = await this.userService.getOneByEmail(email)

      const isCorrectPassword = await user.checkPassword(password)

      if (!isCorrectPassword) throw badRequestError('Wrong password')
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
      return
    }

    try {
      const session = await this.sessionService.create(user)
      const result = merge(pick(user, 'id', 'role'), pick(session, 'token'))

      res.status(StatusCodes.OK).send(result)
      return
    } catch {
      const error = serverError('Sign in error')
      res.status(error.status).send(error)
      return
    }
  }
}

export default new AuthController()
