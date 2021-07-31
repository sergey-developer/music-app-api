import { connect } from 'mongoose'

import dbConfig from './dbConfig'

const connectDb = async () => {
  try {
    await connect(dbConfig.dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })

    console.log('Mongoose connected')
  } catch (error) {
    console.error('Failed connection to database: ', error)

    process.exit(1)
  }
}

export default connectDb
