import express from 'express'

import auth from 'api/auth/middlewares/auth.middleware'
import { TrackController } from 'api/track/controller'
import {
  CreateTrackDto,
  DeleteOneTrackByIdParams,
  GetAllTracksQuery,
} from 'api/track/dto'
import { APIRoute } from 'app/routes/interface'
import { makeRoutePath } from 'app/routes/utils'
import { body, params, query } from 'shared/middlewares/validation'

const route: APIRoute = (app) => {
  const router = express.Router()
  const routePath = makeRoutePath('tracks')

  router.get('/', query(GetAllTracksQuery), TrackController.getAll)

  router.post('/', [auth, body(CreateTrackDto)], TrackController.createOne)

  router.delete(
    '/:id',
    [auth, params(DeleteOneTrackByIdParams)],
    TrackController.deleteOneById,
  )

  app.use(routePath, router)
}

export default route
