import { ArtistController } from 'modules/artist/controller'
import {
  CreateArtistDto,
  DeleteOneArtistByIdParams,
  GetAllArtistsQuery,
} from 'modules/artist/dto'
import { auth } from 'modules/auth/middlewares'
import { CreateRouter } from 'shared/interface/router'
import { body, params, query } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.get('/', query(GetAllArtistsQuery), ArtistController.getAll)

  router.post('/', [auth, body(CreateArtistDto)], ArtistController.createOne)

  router.delete(
    '/:id',
    [auth, params(DeleteOneArtistByIdParams)],
    ArtistController.deleteOneById,
  )

  return router
}

export default createRouter
