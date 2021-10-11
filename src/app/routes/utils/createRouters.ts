import express, { Application } from 'express'

import routers from 'app/routes/routers'
import { makeRoutePath } from 'app/routes/utils'
import logger from 'lib/logger'

const createRouters = (app: Application): void => {
  const router = express.Router()

  routers.forEach(({ name, create }) => {
    const routePath = makeRoutePath(name)
    const createdRouter = create(router)
    logger.info(`Route "${name}" created at path "${routePath}"`)

    app.use(routePath, createdRouter)
  })
}

export default createRouters
