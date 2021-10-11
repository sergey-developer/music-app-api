import express, { Application } from 'express'

import { ApiRouter } from 'api/routers/interface'
import { appConfig } from 'configs/app'
import logger from 'lib/logger'

// TODO: валидировать subPath
const makeRoutePath = (subPath: string): string => {
  return `${appConfig.basePath}/${subPath}`
}

export const createRouters =
  (routers: ApiRouter[]) =>
  (app: Application): void => {
    const router = express.Router()

    routers.forEach(({ name, create }) => {
      const routePath = makeRoutePath(name)
      const createdRouter = create(router)
      logger.info(`Route "${name}" created at path "${routePath}"`)

      app.use(routePath, createdRouter)
    })
  }
