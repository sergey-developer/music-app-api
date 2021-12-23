import { container as DiContainer } from 'tsyringe'

import { CreateRouter } from 'api/interface'
import { IdParam } from 'app/dto'
import uploadImage from 'app/middlewares/uploadImage.middleware'
import { body, params, query } from 'app/middlewares/validation'
import { ArtistController } from 'modules/artist/controller'
import {
  CreateArtistDto,
  GetAllArtistsQuery,
  UpdateArtistDto,
} from 'modules/artist/dto'
import { auth } from 'modules/auth/middlewares'
import { validateStatus } from 'modules/request/middleware'

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
    [
      auth,
      params(IdParam),
      uploadImage('photo'),
      body(UpdateArtistDto),
      validateStatus({ byEntity: true }),
    ],
    artistController.updateOne,
  )

  router.delete('/:id', [auth, params(IdParam)], artistController.deleteOne)

  return router
}

export default createRouter
