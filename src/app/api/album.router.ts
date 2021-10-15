import { CreateRouter } from 'api/interface'
import { AlbumController } from 'modules/album/controller'
import {
  CreateAlbumDto,
  DeleteAlbumParams,
  GetAlbumParams,
  GetAllAlbumsQuery,
  UpdateAlbumDto,
  UpdateAlbumParams,
} from 'modules/album/dto'
import { auth } from 'modules/auth/middlewares'
import { body, params, query } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.get('/', query(GetAllAlbumsQuery), AlbumController.getAll)

  router.get('/:id', [auth, params(GetAlbumParams)], AlbumController.getOne)

  router.post('/', [auth, body(CreateAlbumDto)], AlbumController.create)

  router.put(
    '/:id',
    [auth, params(UpdateAlbumParams), body(UpdateAlbumDto)],
    AlbumController.update,
  )

  router.delete(
    '/:id',
    [auth, params(DeleteAlbumParams)],
    AlbumController.deleteOne,
  )

  return router
}

export default createRouter
