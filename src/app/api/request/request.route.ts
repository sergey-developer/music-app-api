import express from 'express'

import auth from 'api/auth/middlewares/auth.middleware'
import { RequestController } from 'api/request/controller'
import {
  DeleteOneRequestByIdParams,
  GetAllRequestsQuery,
} from 'api/request/dto'
import { APIRoute } from 'app/routes/interface'
import { makeRoutePath } from 'app/routes/utils'
import { params, query } from 'shared/middlewares/validation'

const route: APIRoute = (app) => {
  const router = express.Router()
  const routePath = makeRoutePath('requests')

  router.get('/', [auth, query(GetAllRequestsQuery)], RequestController.getAll)

  router.delete(
    '/:id',
    [auth, params(DeleteOneRequestByIdParams)],
    RequestController.deleteOneById,
  )

  app.use(routePath, router)
}

export default route
