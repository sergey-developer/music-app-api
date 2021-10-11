import express, { Application } from 'express'

import routers from 'api/routers'
import logger from 'lib/logger'
import { makeRoutePath } from 'shared/utils/router'

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
