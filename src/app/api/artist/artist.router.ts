import express from 'express'

import { ArtistController } from 'api/artist/controller'
import { CreateArtistDto } from 'api/artist/dto'
import validateDto from 'app/middlewares/validateDto.middleware'
import { makeRouterPath } from 'app/routers/utils'
import { APIRouter } from 'shared/interface/router'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('artists')

  router.get('/', ArtistController.findAll)

  router.post('/', validateDto(CreateArtistDto), ArtistController.createOne)

  app.use(routerPath, router)
}

export default router
