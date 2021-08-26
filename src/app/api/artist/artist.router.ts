import express from 'express'

import { ArtistController } from 'api/artist/controller'
import { CreateArtistDto } from 'api/artist/dto'
import { makeRouterPath } from 'app/routers/utils'
import validateDto from 'middlewares/validateDto.middleware'
import { APIRouter } from 'shared/interface/router'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('artists')

  router.get('/', ArtistController.getAll)

  router.post('/', validateDto(CreateArtistDto), ArtistController.createOne)

  app.use(routerPath, router)
}

export default router
