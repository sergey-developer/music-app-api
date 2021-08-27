import express from 'express'

import { AuthController } from 'api/auth/controller'
import { SigninUserDto, SignupUserDto } from 'api/auth/dto'
import { APIRouter } from 'app/routers/interface'
import { makeRouterPath } from 'app/routers/utils'
import validateDto from 'shared/middlewares/validateDto.middleware'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('auth')

  router.post('/signup', validateDto(SignupUserDto), AuthController.signup)

  router.post('/signin', validateDto(SigninUserDto), AuthController.signin)

  app.use(routerPath, router)
}

export default router
