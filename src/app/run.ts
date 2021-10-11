import express from 'express'

import { envConfig } from 'configs/env'
import logger from 'lib/logger'

import setup from './setup'

const run = (): void => {
  logger.info('Setting up application...')
  const app = setup(express())
  const port = envConfig.app.port

  app.listen(port, () => {
    logger.info(`Server started on ${port} port`)
  })
}

export default run
