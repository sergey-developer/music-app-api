import config from 'config'
import mongoose from 'mongoose'

import logger from 'lib/logger'

const connect = async (): Promise<void> => {
  try {
    logger.info('Connecting database...')

    const host: string = config.get('db.host')
    const port: number = config.get('db.port')
    const name: string = config.get('db.name')
    const URI = `mongodb://${host}:${port}/${name}`

    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    logger.info('Mongoose connected to the database!')
  } catch (error: any) {
    logger.error(error.stack, {
      message: 'Could`t connect to the database',
    })

    process.exit(1)
  }
}

export default connect
