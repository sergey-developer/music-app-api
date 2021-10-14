import { appConfig } from 'configs/app'

export const routePath = (subPath: string): string => {
  // TODO: валидировать subPath
  return `${appConfig.baseApiPath}/${subPath}`
}
