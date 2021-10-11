import { AlbumController } from 'modules/album/controller'
import {
  CreateAlbumDto,
  DeleteOneAlbumByIdParams,
  GetAllAlbumsQuery,
  GetOneAlbumByIdParams,
} from 'modules/album/dto'
import { auth } from 'modules/auth/middlewares'
import { CreateRouter } from 'shared/interface/router'
import { body, params, query } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.get('/', query(GetAllAlbumsQuery), AlbumController.getAll)

  router.get(
    '/:id',
    [auth, params(GetOneAlbumByIdParams)],
    AlbumController.getOneById,
  )

  router.post('/', [auth, body(CreateAlbumDto)], AlbumController.createOne)

  router.delete(
    '/:id',
    [auth, params(DeleteOneAlbumByIdParams)],
    AlbumController.deleteOneById,
  )

  return router
}

export default createRouter
