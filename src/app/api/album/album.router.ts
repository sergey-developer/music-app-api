import express from 'express'

import { AlbumController } from 'api/album/controller'
import { CreateAlbumDto } from 'api/album/dto'
import { APIRouter } from 'app/routers/interface'
import { makeRouterPath } from 'app/routers/utils'
import validateDto from 'shared/middlewares/validateDto.middleware'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('albums')

  router.get('/', AlbumController.getAll)

  router.post('/', validateDto(CreateAlbumDto), AlbumController.createOne)

  app.use(routerPath, router)
}

export default router
