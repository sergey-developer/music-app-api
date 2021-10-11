import auth from 'api/auth/middlewares/auth.middleware'
import { ImageController } from 'api/image/controller'
import { DeleteOneImageByIdParams } from 'api/image/dto'
import { upload } from 'api/uploads/middlewares/upload'
import { CreateRouter } from 'app/routes/interface'
import { params } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.post(
    '/images',
    [auth, upload.single('image')],
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
