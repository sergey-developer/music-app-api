import express from 'express'

import auth from 'api/auth/middlewares/auth.middleware'
import { TrackHistoryController } from 'api/trackHistory/controller'
import { CreateTrackHistoryDto } from 'api/trackHistory/dto'
import { APIRouter } from 'app/routers/interface'
import { makeRouterPath } from 'app/routers/utils'
import { body } from 'shared/middlewares/validation'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('trackHistory')

  router.get('/', auth, TrackHistoryController.getAll)

  router.post(
    '/',
    [auth, body(CreateTrackHistoryDto)],
    TrackHistoryController.createOne,
  )

  app.use(routerPath, router)
}

export default router
