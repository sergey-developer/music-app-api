import 'reflect-metadata'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application } from 'express'

export default (app: Application): Application => {
  app.use(express.json())
  app.use(cors())
  app.use(cookieParser())
  // app.use(cookieParser(envConfig.app.cookieSecret))

  return app
}
