import path from 'path'

interface IAppConfig {
  rootPath: string
  uploadPath: string
  logsPath: string
  basePath: string
}

const rootPath = process.cwd()

const config: IAppConfig = {
  rootPath,
  uploadPath: path.join(rootPath, '/public/uploads'),
  logsPath: path.join(rootPath, '/logs'),
  basePath: '/api',
}

export default config
