import { CreateRouter } from 'api/interface'
import { AlbumController } from 'modules/album/controller'
import {
  CreateAlbumDto,
  DeleteOneAlbumByIdParams,
  GetAllAlbumsQuery,
  GetOneAlbumByIdParams,
  UpdateAlbumByIdParams,
  UpdateAlbumDto,
} from 'modules/album/dto'
import { auth } from 'modules/auth/middlewares'
import { body, params, query } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.get('/', query(GetAllAlbumsQuery), AlbumController.getAll)

  router.get(
    '/:id',
    [auth, params(GetOneAlbumByIdParams)],
    AlbumController.getOneById,
  )

  router.post('/', [auth, body(CreateAlbumDto)], AlbumController.create)

  router.put(
    '/:id',
    [auth, params(UpdateAlbumByIdParams), body(UpdateAlbumDto)],
    AlbumController.updateById,
  )

  router.delete(
    '/:id',
    [auth, params(DeleteOneAlbumByIdParams)],
    AlbumController.deleteOneById,
  )

  return router
}

export default createRouter
