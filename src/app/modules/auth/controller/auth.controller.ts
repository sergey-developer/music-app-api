import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'
import { singleton } from 'tsyringe'

import { IAuthController } from 'modules/auth/controller'
import { AuthService } from 'modules/auth/service'
import {
  getHttpErrorByAppError,
  isNotFoundError,
} from 'app/utils/errors/httpErrors'

@singleton()
class AuthController implements IAuthController {
  public constructor(private readonly authService: AuthService) {}

  public signin: IAuthController['signin'] = async (req, res) => {
    try {
      const payload = pick(req.body, 'email', 'password')
      const result = await this.authService.signin(payload)

      res.status(StatusCodes.OK).send({ data: result })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }

  public signup: IAuthController['signup'] = async (req, res) => {
    try {
      const payload = pick(req.body, 'email', 'username', 'password')
      const result = await this.authService.signup(payload)

      res.status(StatusCodes.OK).send({ data: result })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
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
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)

      if (isNotFoundError(httpError)) {
        res.sendStatus(StatusCodes.OK)
        return
      }

      res.status(httpError.status).send(httpError)
    }
  }
}

export default AuthController
