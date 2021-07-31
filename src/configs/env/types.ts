export type EnvConfigType = {
  env: string
  app: {
    name: string
    port: number
  }
  db: {
    host: string
    port: number
    name: string
  }
}
