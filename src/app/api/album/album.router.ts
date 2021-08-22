import express from 'express'

import { AlbumController } from 'api/album/controller'
import { CreateAlbumDto } from 'api/album/dto'
import validateDto from 'app/middlewares/validateDto.middleware'
import { makeRouterPath } from 'app/routers/utils'
import { APIRouter } from 'shared/interface/router'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('albums')

  router.get('/', AlbumController.getAll)

  router.post('/', validateDto(CreateAlbumDto), AlbumController.createOne)

  app.use(routerPath, router)
}

export default router
