const basePath: string = '/api'

const makeRoutePath = (subPath: string): string => {
  // TODO: check and remove "/" from subPath
  return `${basePath}/${subPath}`
}

export { makeRoutePath }
