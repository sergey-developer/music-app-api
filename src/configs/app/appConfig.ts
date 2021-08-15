import path from 'path'

interface IAppConfig {
  rootPath: string
  uploadPath: string
  basePath: string
}

const rootPath = process.cwd()

const config: IAppConfig = {
  rootPath,
  uploadPath: path.join(rootPath, '/public/uploads'),
  basePath: '/api',
}

export default config
