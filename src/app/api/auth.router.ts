import { CreateRouter } from 'api/interface'
import { AuthController } from 'modules/auth/controller'
import { SigninUserDto, SignupUserDto } from 'modules/auth/dto'
import { body } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.post('/signin', body(SigninUserDto), AuthController.signin)

  router.post('/signup', body(SignupUserDto), AuthController.signup)

  router.post('/logout', AuthController.logout)

  return router
}

export default createRouter
