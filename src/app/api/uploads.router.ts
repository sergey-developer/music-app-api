import { CreateRouter } from 'api/interface'
import { auth } from 'modules/auth/middlewares'
import { ImageController } from 'modules/image/controller'
import { uploadImage } from 'modules/image/middlewares'
import { IdParam } from 'shared/dto'
import { params } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.post(
    '/images',
    [auth, uploadImage.single('image')],
    ImageController.createOne,
  )

  router.put(
    '/images/:id',
    [auth, uploadImage.single('image')],
    ImageController.update,
  )

  router.delete(
    '/images/:id',
    [auth, params(IdParam)],
    ImageController.deleteOne,
  )

  return router
}

export default createRouter
