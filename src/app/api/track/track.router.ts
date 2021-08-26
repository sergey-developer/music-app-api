import express from 'express'

import { TrackController } from 'api/track/controller'
import { CreateTrackDto } from 'api/track/dto'
import { makeRouterPath } from 'app/routers/utils'
import validateDto from 'middlewares/validateDto.middleware'
import { APIRouter } from 'shared/interface/router'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('tracks')

  router.get('/', TrackController.getAll)

  router.post('/', validateDto(CreateTrackDto), TrackController.createOne)

  app.use(routerPath, router)
}

export default router
