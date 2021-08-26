import { ISessionService, SessionService } from 'api/session/service'
import { IUserController } from 'api/user/controller'
import { IUserService, UserService } from 'api/user/service'

class UserController implements IUserController {
  private readonly userService: IUserService
  private readonly sessionService: ISessionService

  public constructor() {
    this.userService = UserService
    this.sessionService = SessionService
  }

  public create: IUserController['create'] = async (req, res) => {
    try {
      const user = await this.userService.create(req.body)
      const session = await this.sessionService.create({
        userId: user.id,
        email: user.email,
      })

      res.send({ data: { role: user.role, token: session.token } })
    } catch (error) {
      // TODO: если ошибки при создании сессии то удалять созданного пользователя
      res.status(error.statusCode).send(error)
    }
  }
}

export default new UserController()
