import express from 'express'

import { ArtistController } from 'api/artist/controller'
import { CreateArtistDto, GetAllArtistsQuery } from 'api/artist/dto'
import auth from 'api/auth/middlewares/auth.middleware'
import { APIRoute } from 'app/routes/interface'
import { makeRoutePath } from 'app/routes/utils'
import { body, query } from 'shared/middlewares/validation'

const route: APIRoute = (app) => {
  const router = express.Router()
  const routePath = makeRoutePath('artists')

  router.get('/', query(GetAllArtistsQuery), ArtistController.getAll)

  router.post('/', [auth, body(CreateArtistDto)], ArtistController.createOne)

  app.use(routePath, router)
}

export default route
