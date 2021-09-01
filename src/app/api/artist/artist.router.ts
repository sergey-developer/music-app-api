import express from 'express'

import { ArtistController } from 'api/artist/controller'
import { CreateArtistDto, GetAllArtistsQuery } from 'api/artist/dto'
import auth from 'api/auth/middlewares/auth.middleware'
import { APIRouter } from 'app/routers/interface'
import { makeRouterPath } from 'app/routers/utils'
import { body, query } from 'shared/middlewares/validation'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('artists')

  router.get('/', query(GetAllArtistsQuery), ArtistController.getAll)

  router.post('/', [auth, body(CreateArtistDto)], ArtistController.createOne)

  app.use(routerPath, router)
}

export default router
