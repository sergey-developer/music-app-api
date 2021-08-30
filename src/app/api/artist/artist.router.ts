import express from 'express'

import { ArtistController } from 'api/artist/controller'
import { CreateArtistDto } from 'api/artist/dto'
import auth from 'api/auth/middlewares/auth.middleware'
import { APIRouter } from 'app/routers/interface'
import { makeRouterPath } from 'app/routers/utils'
import validateDto from 'shared/middlewares/validateDto.middleware'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('artists')

  router.get('/', ArtistController.getAll)

  router.post(
    '/',
    [auth, validateDto(CreateArtistDto)],
    ArtistController.createOne,
  )

  app.use(routerPath, router)
}

export default router
