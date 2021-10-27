import 'reflect-metadata'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application } from 'express'

import { createRouters } from 'api/utils'
import routers from 'app/api'
import { registerDependencies } from 'app/utils'

const setupApp = (app: Application): Application => {
  app.use(express.static('public/uploads/images'))
  app.use(express.json())
  app.use(cors())
  app.use(cookieParser())
  // app.use(cookieParser(envConfig.app.cookieSecret))

  registerDependencies()
  createRouters(app, routers)

  return app
}

export default setupApp
