import express, { Application } from 'express'

import { ApiRouter } from 'api/interface'
import { routePath } from 'api/utils'
import logger from 'lib/logger'

export const createRouters = (app: Application, routers: ApiRouter[]): void => {
  routers.forEach(({ name, create }) => {
    const router = express.Router()
    const path = routePath(name)
    const createdRouter = create(router)

    logger.info(`Route "${name}" created at path "${path}"`)

    app.use(path, createdRouter)
  })
}
