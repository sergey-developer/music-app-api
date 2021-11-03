import mongoose from 'mongoose'

import logger from 'lib/logger'

const disconnect = async (): Promise<void> => {
  try {
    await mongoose.connection.close()
  } catch (error: any) {
    logger.error(error.stack, {
      message: 'Could`t disconnect the database',
    })
  }
}

export default disconnect
