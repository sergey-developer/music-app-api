import config from 'config'
import express from 'express'

import logger from 'lib/logger'

import setup from './setup'

const run = (): void => {
  logger.info('Setting up application...')
  const app = setup(express())
  const port: number = config.get('app.port')

  app.listen(port, () => {
    logger.info(`Server started on ${port} port`)
  })
}

export default run
