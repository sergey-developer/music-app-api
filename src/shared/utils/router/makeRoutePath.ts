import { appConfig } from 'configs/app'

// TODO: валидировать subPath
const makeRoutePath = (subPath: string): string => {
  return `${appConfig.basePath}/${subPath}`
}

export default makeRoutePath
