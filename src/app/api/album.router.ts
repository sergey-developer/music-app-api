import { CreateRouter } from 'api/interface'
import { AlbumController } from 'modules/album/controller'
import {
  CreateAlbumDto,
  GetAllAlbumsQuery,
  UpdateAlbumDto,
} from 'modules/album/dto'
import { auth } from 'modules/auth/middlewares'
import { IdParam } from 'shared/dto'
import { body, params, query } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.get('/', query(GetAllAlbumsQuery), AlbumController.getAll)

  router.get('/:id', [auth, params(IdParam)], AlbumController.getOne)

  router.post('/', [auth, body(CreateAlbumDto)], AlbumController.createOne)

  router.put(
    '/:id',
    [auth, params(IdParam), body(UpdateAlbumDto)],
    AlbumController.updateOne,
  )

  router.delete('/:id', [auth, params(IdParam)], AlbumController.deleteOne)

  return router
}

export default createRouter
