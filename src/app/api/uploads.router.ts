import { CreateRouter } from 'api/routers/interface'
import { auth } from 'modules/auth/middlewares'
import { ImageController } from 'modules/image/controller'
import { DeleteOneImageByIdParams } from 'modules/image/dto'
import { upload } from 'modules/uploads/middlewares/upload'
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
