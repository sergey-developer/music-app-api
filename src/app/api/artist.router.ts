import { CreateRouter } from 'api/interface'
import { ArtistController } from 'modules/artist/controller'
import {
  CreateArtistDto,
  GetAllArtistsQuery,
  UpdateArtistDto,
} from 'modules/artist/dto'
import { auth } from 'modules/auth/middlewares'
import { IdParam } from 'shared/dto'
import uploadImage from 'shared/middlewares/uploadImage.middleware'
import { body, params, query } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.get('/', query(GetAllArtistsQuery), ArtistController.getAll)

  router.get('/:id', [auth, params(IdParam)], ArtistController.getOne)

  router.post(
    '/',
    [auth, uploadImage('photo'), body(CreateArtistDto)],
    ArtistController.createOne,
  )

  router.put(
    '/:id',
    [auth, params(IdParam), uploadImage('photo'), body(UpdateArtistDto)],
    ArtistController.updateOne,
  )

  router.delete('/:id', [auth, params(IdParam)], ArtistController.deleteOne)

  return router
}

export default createRouter
