import express from 'express'

import auth from 'api/auth/middlewares/auth.middleware'
import { TrackController } from 'api/track/controller'
import { CreateTrackDto } from 'api/track/dto'
import { APIRouter } from 'app/routers/interface'
import { makeRouterPath } from 'app/routers/utils'
import validateDto from 'shared/middlewares/validateDto.middleware'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('tracks')

  router.get('/', TrackController.getAll)

  router.post(
    '/',
    [auth, validateDto(CreateTrackDto)],
    TrackController.createOne,
  )

  app.use(routerPath, router)
}

export default router
