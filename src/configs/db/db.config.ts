import { envConfig } from 'configs/env'

interface IDbConfig {
  dbURL: string
}

const config: IDbConfig = {
  dbURL: `mongodb://${envConfig.db.host}:${envConfig.db.port}/${envConfig.db.name}`,
}

export default config
