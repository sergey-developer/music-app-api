import { container as DiContainer } from 'tsyringe'

import { CreateRouter } from 'api/interface'
import { IdParam } from 'app/dto'
import uploadImage from 'app/middlewares/uploadImage.middleware'
import { body, params, query } from 'app/middlewares/validation'
import { AlbumController } from 'modules/album/controller'
import {
  CreateAlbumDto,
  GetAllAlbumsQuery,
  UpdateAlbumDto,
} from 'modules/album/dto'
import { auth } from 'modules/auth/middlewares'

const albumController = DiContainer.resolve(AlbumController)

const createRouter: CreateRouter = (router) => {
  router.get('/', query(GetAllAlbumsQuery), albumController.getAll)

  router.get('/:id', [auth, params(IdParam)], albumController.getOne)

  router.post(
    '/',
    [auth, uploadImage('image'), body(CreateAlbumDto)],
    albumController.createOne,
  )

  router.put(
    '/:id',
    [auth, params(IdParam), uploadImage('image'), body(UpdateAlbumDto)],
    albumController.updateOne,
  )

  router.delete('/:id', [auth, params(IdParam)], albumController.deleteOne)

  return router
}

export default createRouter
