import express from 'express'

import auth from 'api/auth/middlewares/auth.middleware'
import { ImageController } from 'api/image/controller'
import { upload } from 'api/uploads/middlewares/upload'
import { APIRouter } from 'app/routers/interface'
import { makeRouterPath } from 'app/routers/utils'
import { params } from 'shared/middlewares/validation'
import { IdParam } from 'shared/utils/validation'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('uploads')

  router.post(
    '/images',
    [auth, upload.single('image')],
    ImageController.createOne,
  )

  router.delete(
    '/images/:id',
    [auth, params(IdParam)],
    ImageController.deleteOneById,
  )

  app.use(routerPath, router)
}

export default router
