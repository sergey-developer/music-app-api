import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'
import { singleton } from 'tsyringe'

import { IAuthController } from 'modules/auth/controller'
import { AuthService } from 'modules/auth/service'
import {
  ensureHttpError,
  isNotFoundError,
} from 'shared/utils/errors/httpErrors'

@singleton()
class AuthController implements IAuthController {
  public constructor(private readonly authService: AuthService) {}

  public signin: IAuthController['signin'] = async (req, res) => {
    try {
      const payload = pick(req.body, 'email', 'password')
      const result = await this.authService.signin(payload)

      res.status(StatusCodes.OK).send({ data: result })
    } catch (exception: any) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public signup: IAuthController['signup'] = async (req, res) => {
    try {
      const payload = pick(req.body, 'email', 'username', 'password')
      const result = await this.authService.signup(payload)

      res.status(StatusCodes.OK).send({ data: result })
    } catch (exception: any) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public logout: IAuthController['logout'] = async (req, res) => {
    try {
      const token = req.cookies.token

      if (!token) {
        res.sendStatus(StatusCodes.OK)
        return
      }

      await this.authService.logout(token)

      res.sendStatus(StatusCodes.OK)
    } catch (exception: any) {
      if (isNotFoundError(exception)) {
        res.sendStatus(StatusCodes.OK)
        return
      }

      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default AuthController
