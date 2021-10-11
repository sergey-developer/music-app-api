import { auth } from 'api/auth'
import { upload } from 'api/uploads/middlewares/upload'
import { ImageController } from 'modules/image/controller'
import { DeleteOneImageByIdParams } from 'modules/image/dto'
import { CreateRouter } from 'shared/interface/router'
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
