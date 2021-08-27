import express from 'express'

import { ImageController } from 'api/image/controller'
import { upload } from 'api/uploads/middlewares/upload'
import { APIRouter } from 'app/routers/interface'
import { makeRouterPath } from 'app/routers/utils'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('uploads')

  router.post('/images', upload.single('image'), ImageController.createOne)

  router.delete('/images/:id', ImageController.deleteOneById)

  app.use(routerPath, router)
}

export default router
