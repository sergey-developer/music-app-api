export interface IEnvConfig {
  env: string
  app: {
    name: string
    port: number
    tokenSecret: string
  }
  db: {
    host: string
    port: number
    name: string
  }
}
