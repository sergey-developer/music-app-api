import { envConfig } from 'configs/env'

type DbConfigType = {
  dbURL: string
}

const config: DbConfigType = {
  dbURL: `mongodb://${envConfig.db.host}:${envConfig.db.port}/${envConfig.db.name}`,
}

export default config
