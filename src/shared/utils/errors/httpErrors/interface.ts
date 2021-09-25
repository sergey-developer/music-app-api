import createError from 'http-errors'

export interface IHttpError {
  create: (
    message?: string,
    props?: Record<string, any>,
  ) => ReturnType<typeof createError>

  verify: (error: unknown) => boolean
}
