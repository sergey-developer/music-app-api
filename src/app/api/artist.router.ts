import { CreateRouter } from 'api/interface'
import { ArtistController } from 'modules/artist/controller'
import { CreateArtistDto, GetAllArtistsQuery } from 'modules/artist/dto'
import { auth } from 'modules/auth/middlewares'
import { IdParam } from 'shared/dto'
import { body, params, query } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.get('/', query(GetAllArtistsQuery), ArtistController.getAll)

  router.get('/:id', [auth, params(IdParam)], ArtistController.getOne)

  router.post('/', [auth, body(CreateArtistDto)], ArtistController.create)

  router.delete('/:id', [auth, params(IdParam)], ArtistController.deleteOne)

  return router
}

export default createRouter
