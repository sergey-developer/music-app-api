import createError from 'http-errors'

export default (error: unknown): boolean => createError.isHttpError(error)
