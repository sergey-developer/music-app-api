import 'reflect-metadata'

import config from 'config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application } from 'express'

import { createRouters } from 'api/utils'
import routers from 'app/api'
import registerDependencies from 'lib/dependency-injection/registerDependencies'

const setupApp = (app: Application): Application => {
  app.use(express.static(config.get('app.uploads.imagesDir')))
  app.use(express.json())
  app.use(cors())
  app.use(cookieParser())
  // app.use(cookieParser(envConfig.app.cookieSecret))

  registerDependencies()
  createRouters(app, routers)

  return app
}

export default setupApp
