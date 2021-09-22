import express from 'express'

import auth from 'api/auth/middlewares/auth.middleware'
import { TrackHistoryController } from 'api/trackHistory/controller'
import { CreateTrackHistoryDto } from 'api/trackHistory/dto'
import { APIRoute } from 'app/routes/interface'
import { makeRoutePath } from 'app/routes/utils'
import { body } from 'shared/middlewares/validation'

const route: APIRoute = (app) => {
  const router = express.Router()
  const routePath = makeRoutePath('trackHistory')

  router.get('/', auth, TrackHistoryController.getAll)

  router.post(
    '/',
    [auth, body(CreateTrackHistoryDto)],
    TrackHistoryController.createOne,
  )

  app.use(routePath, router)
}

export default route
