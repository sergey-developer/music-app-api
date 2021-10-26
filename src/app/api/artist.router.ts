import { container as DiContainer } from 'tsyringe'

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

const artistController = DiContainer.resolve(ArtistController)

const createRouter: CreateRouter = (router) => {
  router.get('/', query(GetAllArtistsQuery), artistController.getAll)

  router.get('/:id', [auth, params(IdParam)], artistController.getOne)

  router.post(
    '/',
    [auth, uploadImage('photo'), body(CreateArtistDto)],
    artistController.createOne,
  )

  router.put(
    '/:id',
    [auth, params(IdParam), uploadImage('photo'), body(UpdateArtistDto)],
    artistController.updateOne,
  )

  router.delete('/:id', [auth, params(IdParam)], artistController.deleteOne)

  return router
}

export default createRouter
