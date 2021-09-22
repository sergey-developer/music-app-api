import express from 'express'

import auth from 'api/auth/middlewares/auth.middleware'
import { ImageController } from 'api/image/controller'
import { DeleteOneImageByIdParams } from 'api/image/dto'
import { upload } from 'api/uploads/middlewares/upload'
import { APIRoute } from 'app/routes/interface'
import { makeRoutePath } from 'app/routes/utils'
import { params } from 'shared/middlewares/validation'

const route: APIRoute = (app) => {
  const router = express.Router()
  const routePath = makeRoutePath('uploads')

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

  app.use(routePath, router)
}

export default route
