import express from 'express'

import { AlbumController } from 'api/album/controller'
import { CreateAlbumDto } from 'api/album/dto'
import { TrackController } from 'api/track/controller'
import { CreateTrackDto } from 'api/track/dto'
import validateDto from 'app/middlewares/validateDto.middleware'
import { makeRouterPath } from 'app/routers/utils'
import { APIRouter } from 'shared/interface/router'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('tracks')

  router.get('/', TrackController.getAll)

  router.post('/', validateDto(CreateTrackDto), TrackController.createOne)

  app.use(routerPath, router)
}

export default router
