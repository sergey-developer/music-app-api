import config from 'config'
import express from 'express'

import logger from 'lib/logger'

import setupApp from './setupApp'

const runApp = (): void => {
  logger.info('Setting up application...')
  const app = setupApp(express())
  const port: number = config.get('app.port')

  app.listen(port, () => {
    logger.info(`Server started on ${port} port`)
  })
}

export default runApp
