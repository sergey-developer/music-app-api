import path from 'path'

interface IAppConfig {
  imageUploadPath: string
  errorLogPath: string
  baseApiPath: string
}

const rootPath = process.cwd()

const uploadPath = '/public/uploads' as const
const logsPath = '/logs' as const

const imageUploadPath = path.join(rootPath, `${uploadPath}/images`)
const errorLogPath = path.join(rootPath, `${logsPath}/errors.log`)

const config: IAppConfig = {
  imageUploadPath,
  errorLogPath,
  baseApiPath: '/api',
}

export default config
