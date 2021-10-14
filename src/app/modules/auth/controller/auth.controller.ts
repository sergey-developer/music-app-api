import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'

import { IAuthController } from 'modules/auth/controller'
import { AuthService, IAuthService } from 'modules/auth/service'
import { ensureHttpError } from 'shared/utils/errors/httpErrors'

class AuthController implements IAuthController {
  private readonly authService: IAuthService

  public constructor() {
    this.authService = AuthService
  }

  public signin: IAuthController['signin'] = async (req, res) => {
    try {
      const payload = pick(req.body, 'email', 'password')
      const result = await this.authService.signin(payload)

      res.status(StatusCodes.OK).send({ data: result })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public signup: IAuthController['signup'] = async (req, res) => {
    try {
      const payload = pick(req.body, 'email', 'username', 'password')
      const result = await this.authService.signup(payload)

      res.status(StatusCodes.OK).send({ data: result })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default new AuthController()
