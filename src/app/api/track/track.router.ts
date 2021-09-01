import express from 'express'

import auth from 'api/auth/middlewares/auth.middleware'
import { TrackController } from 'api/track/controller'
import { CreateTrackDto, GetAllTracksQuery } from 'api/track/dto'
import { APIRouter } from 'app/routers/interface'
import { makeRouterPath } from 'app/routers/utils'
import { body, query } from 'shared/middlewares/validation'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('tracks')

  router.get('/', query(GetAllTracksQuery), TrackController.getAll)

  router.post('/', [auth, body(CreateTrackDto)], TrackController.createOne)

  app.use(routerPath, router)
}

export default router
