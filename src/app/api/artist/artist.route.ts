import { ArtistController } from 'api/artist/controller'
import {
  CreateArtistDto,
  DeleteOneArtistByIdParams,
  GetAllArtistsQuery,
} from 'api/artist/dto'
import auth from 'api/auth/middlewares/auth.middleware'
import { CreateRouter } from 'app/routes/interface'
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
