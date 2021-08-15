import 'reflect-metadata'

import express, { Application } from 'express'

import { createRouters } from 'app/routers'
import { envConfig } from 'configs/env'

import setupApp from './setupApp'

const runApp = () => {
  const expressApp: Application = express()
  const app = setupApp(expressApp)

  app.listen(envConfig.app.port, () => {
    console.log(`Server started on ${envConfig.app.port} port`)

    createRouters(app)
  })
}

export default runApp
