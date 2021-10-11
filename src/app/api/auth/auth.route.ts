import { AuthController } from 'api/auth/controller'
import { SigninUserDto, SignupUserDto } from 'api/auth/dto'
import { CreateRouter } from 'app/routes/interface'
import { body } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.post('/signup', body(SignupUserDto), AuthController.signup)

  router.post('/signin', body(SigninUserDto), AuthController.signin)

  return router
}

export default createRouter
