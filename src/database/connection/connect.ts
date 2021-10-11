import { connect } from 'mongoose'

import { dbConfig } from 'configs/db'
import logger from 'lib/logger'

const connectDatabase = async () => {
  try {
    logger.info('Connecting database...')

    await connect(dbConfig.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    logger.info('Mongoose connected to the database')
  } catch (error) {
    console.error('Cannot connect to the database: ', error)

    process.exit(1)
  }
}

export default connectDatabase
