import { IEnvConfig } from 'configs/env/interface'

const env: string = process.env.NODE_ENV || 'dev'
const appName: string = 'music-app'

const defaultDbPort: number = 27017
const defaultDbHost: string = 'localhost'

const defaultAppPort: number = 8000

const makeDefaultDbName = (): string => {
  return `${appName}-${env}`
}

const dev: IEnvConfig = {
  env,
  app: {
    name: appName,
    port: process.env.DEV_APP_PORT
      ? parseInt(process.env.DEV_APP_PORT)
      : defaultAppPort,
  },
  db: {
    host: process.env.DEV_DB_HOST || defaultDbHost,
    port: process.env.DEV_DB_PORT
      ? parseInt(process.env.DEV_DB_PORT)
      : defaultDbPort,
    name: process.env.DEV_DB_NAME || makeDefaultDbName(),
  },
}

const test: IEnvConfig = {
  env,
  app: {
    name: appName,
    port: process.env.TEST_APP_PORT
      ? parseInt(process.env.TEST_APP_PORT)
      : defaultAppPort,
  },
  db: {
    host: process.env.TEST_DB_HOST || defaultDbHost,
    port: process.env.TEST_DB_PORT
      ? parseInt(process.env.TEST_DB_PORT)
      : defaultDbPort,
    name: process.env.TEST_DB_NAME || makeDefaultDbName(),
  },
}

const config: Record<string, IEnvConfig> = {
  dev,
  test,
}

export default config[env]
