import { AlbumController } from 'api/album/controller'
import {
  CreateAlbumDto,
  DeleteOneAlbumByIdParams,
  GetAllAlbumsQuery,
} from 'api/album/dto'
import { GetOneAlbumByIdParams } from 'api/album/dto/params.dto'
import auth from 'api/auth/middlewares/auth.middleware'
import { CreateRouter } from 'app/routes/interface'
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
