import 'reflect-metadata'

import cors from 'cors'
import express, { Application } from 'express'

export default (app: Application): Application => {
  app.use(express.json())
  app.use(cors())

  return app
}
