import { IAuthController } from 'api/auth/controller'
import { ISessionService, SessionService } from 'api/session/service'
import { IUserService, UserService } from 'api/user/service'

class AuthController implements IAuthController {
  private readonly userService: IUserService
  private readonly sessionService: ISessionService

  public constructor() {
    this.userService = UserService
    this.sessionService = SessionService
  }

  public signup: IAuthController['signup'] = async (req, res) => {
    try {
      const user = await this.userService.create(req.body)
      const session = await this.sessionService.create(user)

      res.send({ data: { id: user.id, role: user.role, token: session.token } })
    } catch (error) {
      // TODO: если ошибки при создании сессии то удалять созданного пользователя
      res.status(500).send(error)
    }
  }

  public signin: IAuthController['signin'] = async (req, res) => {
    try {
      const user = await this.userService.getOneByEmail(req.body.email)

      if (!user) {
        throw new Error('User not found')
      }

      const passwordIsMatch = await user.checkPassword(req.body.password)

      if (!passwordIsMatch) {
        throw new Error('Wrong password')
      }

      const session = await this.sessionService.create(user)

      res.send({ data: { id: user.id, role: user.role, token: session.token } })
    } catch (error) {
      res.status(500).send(error)
    }
  }
}

export default new AuthController()
