import express, { Application } from 'express'

import { createRoutes } from 'app/routes'
import { envConfig } from 'configs/env'

import setupApp from './setupApp'

const runApp = () => {
  const expressApp: Application = express()
  const app = setupApp(expressApp)

  app.listen(envConfig.app.port, () => {
    console.log(`Server started on ${envConfig.app.port} port`)

    createRoutes(app)
  })
}

export default runApp
