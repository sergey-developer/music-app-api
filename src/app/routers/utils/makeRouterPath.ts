import { appConfig } from 'configs/app'

// TODO: валидировать subPath
const makeRouterPath = (subPath: string): string => {
  return `${appConfig.basePath}/${subPath}`
}

export default makeRouterPath
