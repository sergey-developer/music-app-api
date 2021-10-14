import { CreateRouter } from 'api/interface'
import { auth } from 'modules/auth/middlewares'
import { ImageController } from 'modules/image/controller'
import { DeleteOneImageByIdParams } from 'modules/image/dto'
import { uploadImage } from 'modules/image/middlewares'
import { params } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.post(
    '/images',
    [auth, uploadImage.single('image')],
    ImageController.createOne,
  )

  router.delete(
    '/images/:id',
    [auth, params(DeleteOneImageByIdParams)],
    ImageController.deleteOneById,
  )

  return router
}

export default createRouter
