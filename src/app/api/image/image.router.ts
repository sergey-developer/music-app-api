import express from 'express'

import { ImageController } from 'api/image/controller'
import upload from 'app/middlewares/upload.middleware'
import { makeRouterPath } from 'app/routers/utils'
import { APIRouter } from 'shared/interface/router'

const router: APIRouter = (app) => {
  const router = express.Router()
  const routerPath = makeRouterPath('uploads/images')

  router.post('/', upload.single('image'), ImageController.createOne)
  router.delete('/:id', ImageController.deleteOneById)

  app.use(routerPath, router)
}

export default router
