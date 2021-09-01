import express from 'express'

import auth from 'api/auth/middlewares/auth.middleware'
import { RequestController } from 'api/request/controller'
import { GetAllRequestsQuery } from 'api/request/dto'
import { APIRouter } from 'app/routers/interface'
import { makeRouterPath } from 'app/routers/utils'
import { params, query } from 'shared/middlewares/validation'
import { IdParam } from 'shared/utils/validation'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('requests')

  router.get('/', [auth, query(GetAllRequestsQuery)], RequestController.getAll)

  router.delete(
    '/:id',
    [auth, params(IdParam)],
    RequestController.deleteOneById,
  )

  app.use(routerPath, router)
}

export default router
