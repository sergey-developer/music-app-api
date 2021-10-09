import { connect } from 'mongoose'

import { dbConfig } from 'configs/db'

const connectDatabase = async () => {
  try {
    await connect(dbConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('Mongoose connected to the database')
  } catch (error) {
    console.error('Cannot connect to the database: ', error)

    process.exit(1)
  }
}

export default connectDatabase
