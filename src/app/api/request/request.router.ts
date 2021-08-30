import express from 'express'

import { RequestController } from 'api/request/controller'
import { APIRouter } from 'app/routers/interface'
import { makeRouterPath } from 'app/routers/utils'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('requests')

  router.get('/', RequestController.getAll)

  app.use(routerPath, router)
}

export default router
