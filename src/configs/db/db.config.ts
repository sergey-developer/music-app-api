import { envConfig } from 'configs/env'

interface IDbConfig {
  url: string
}

const config: IDbConfig = {
  url: `mongodb://${envConfig.db.host}:${envConfig.db.port}/${envConfig.db.name}`,
}

export default config
