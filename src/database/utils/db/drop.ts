import mongoose from 'mongoose'

import logger from 'lib/logger'

const drop = async (): Promise<void> => {
  try {
    await mongoose.connection.dropDatabase()
  } catch (error: any) {
    logger.error(error.stack, {
      message: 'Could`t drop the database',
    })
  }
}

export default drop
