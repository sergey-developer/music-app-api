import express from 'express'

import { envConfig } from 'configs/env'
import logger from 'lib/logger'

import setupApp from './setupApp'

const runApp = (): void => {
  logger.info('Setting up application...')
  const app = setupApp(express())
  const port = envConfig.app.port

  app.listen(port, () => {
    logger.info(`Server started on ${port} port`)
  })
}

export default runApp
