import express from 'express'

import auth from 'api/auth/middlewares/auth.middleware'
import { RequestController } from 'api/request/controller'
import { APIRouter } from 'app/routers/interface'
import { makeRouterPath } from 'app/routers/utils'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('requests')

  router.get('/', auth, RequestController.getAll)

  router.delete('/', auth, RequestController.deleteOneById)

  app.use(routerPath, router)
}

export default router
