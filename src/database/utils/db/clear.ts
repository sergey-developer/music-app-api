import mongoose from 'mongoose'

import logger from 'lib/logger'

const clear = async (): Promise<void> => {
  try {
    const collections = mongoose.connection.collections

    for (const key in collections) {
      const collection = collections[key]
      await collection.deleteMany({})
    }
  } catch (error: any) {
    logger.error(error.stack, {
      message: 'Could`t clear the database',
    })
  }
}

export default clear
