import { container as DiContainer } from 'tsyringe'

import { CreateRouter } from 'api/interface'
import { AuthController } from 'modules/auth/controller'
import { SigninUserDto, SignupUserDto } from 'modules/auth/dto'
import { body } from 'shared/middlewares/validation'

const authController = DiContainer.resolve(AuthController)

const createRouter: CreateRouter = (router) => {
  router.post('/signin', body(SigninUserDto), authController.signin)

  router.post('/signup', body(SignupUserDto), authController.signup)

  router.post('/logout', authController.logout)

  return router
}

export default createRouter
