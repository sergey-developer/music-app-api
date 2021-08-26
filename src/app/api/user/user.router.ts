import express from 'express'

import { UserController } from 'api/user/controller'
import { CreateUserDto } from 'api/user/dto'
import { makeRouterPath } from 'app/routers/utils'
import validateDto from 'middlewares/validateDto.middleware'
import { APIRouter } from 'shared/interface/router'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('users')

  router.post('/', validateDto(CreateUserDto), UserController.create)

  app.use(routerPath, router)
}

export default router
