import 'reflect-metadata'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application } from 'express'

import { createRouters } from 'api/utils'
import routers from 'app/api'

const setup = (app: Application): Application => {
  app.use(express.json())
  app.use(cors())
  app.use(cookieParser())
  // app.use(cookieParser(envConfig.app.cookieSecret))

  createRouters(app, routers)

  return app
}

export default setup
