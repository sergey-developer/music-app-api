const throwError = (msg?: string): never => {
  throw new Error(msg)
}

export default throwError
