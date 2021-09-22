import express from 'express'

import { AuthController } from 'api/auth/controller'
import { SigninUserDto, SignupUserDto } from 'api/auth/dto'
import { APIRoute } from 'app/routes/interface'
import { makeRoutePath } from 'app/routes/utils'
import { body } from 'shared/middlewares/validation'

const route: APIRoute = (app) => {
  const router = express.Router()
  const routePath = makeRoutePath('auth')

  router.post('/signup', body(SignupUserDto), AuthController.signup)

  router.post('/signin', body(SigninUserDto), AuthController.signin)

  app.use(routePath, router)
}

export default route
