import express from 'express'

import { AlbumController } from 'api/album/controller'
import {
  CreateAlbumDto,
  DeleteOneAlbumByIdParams,
  GetAllAlbumsQuery,
} from 'api/album/dto'
import { GetOneAlbumByIdParams } from 'api/album/dto/params.dto'
import auth from 'api/auth/middlewares/auth.middleware'
import { APIRoute } from 'app/routes/interface'
import { makeRoutePath } from 'app/routes/utils'
import { body, params, query } from 'shared/middlewares/validation'

const route: APIRoute = (app) => {
  const router = express.Router()
  const routePath = makeRoutePath('albums')

  router.get('/', query(GetAllAlbumsQuery), AlbumController.getAll)

  router.get(
    '/:id',
    [auth, params(GetOneAlbumByIdParams)],
    AlbumController.getOneById,
  )

  router.post('/', [auth, body(CreateAlbumDto)], AlbumController.createOne)

  router.delete(
    '/:id',
    [auth, params(DeleteOneAlbumByIdParams)],
    AlbumController.deleteOneById,
  )

  app.use(routePath, router)
}

export default route
