import express, { Application } from 'express'

import { ApiRouter } from 'api/interface'
import logger from 'lib/logger'

const createRouters = (app: Application, routers: ApiRouter[]): void => {
  routers
    .map(({ name, creator }) => ({ name, router: creator(express.Router()) }))
    .forEach(({ name, router }) => {
      const path = `/api/${name}`

      logger.info(`Route created: "${path}"`)

      app.use(path, router)
    })
}

export default createRouters
