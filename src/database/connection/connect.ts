import { connect } from 'mongoose'

import { dbConfig } from 'configs/db'

const connectDb = async () => {
  try {
    await connect(dbConfig.dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('Mongoose connected to the database')
  } catch (error) {
    console.error('Cannot connect to the database: ', error)

    process.exit(1)
  }
}

export default connectDb
