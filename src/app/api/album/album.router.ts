import express from 'express'

import { AlbumController } from 'api/album/controller'
import { CreateAlbumDto, GetAllQuery, GetOneByIdParams } from 'api/album/dto'
import auth from 'api/auth/middlewares/auth.middleware'
import { APIRouter } from 'app/routers/interface'
import { makeRouterPath } from 'app/routers/utils'
import { body, params, query } from 'shared/middlewares/validation'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('albums')

  router.get('/', query(GetAllQuery), AlbumController.getAll)

  router.get(
    '/:id',
    [auth, params(GetOneByIdParams)],
    AlbumController.getOneById,
  )

  router.post('/', [auth, body(CreateAlbumDto)], AlbumController.createOne)

  app.use(routerPath, router)
}

export default router
