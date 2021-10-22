import config from 'config'
import { connect } from 'mongoose'

import logger from 'lib/logger'

const connectDatabase = async () => {
  try {
    logger.info('Connecting database...')

    const host: string = config.get('db.host')
    const port: number = config.get('db.port')
    const name: string = config.get('db.name')
    const URI = `mongodb://${host}:${port}/${name}`

    await connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    logger.info('Mongoose connected to the database')
  } catch (error) {
    logger.error(error.stack, {
      message: 'Could`t connect to the database',
    })

    process.exit(1)
  }
}

export default connectDatabase
