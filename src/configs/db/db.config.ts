import { envConfig } from 'configs/env'

interface IDbConfig {
  URI: string
}

const config: IDbConfig = {
  URI: `mongodb://${envConfig.db.host}:${envConfig.db.port}/${envConfig.db.name}`,
}

export default config
