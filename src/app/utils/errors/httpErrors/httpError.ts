import createError, { HttpError } from 'http-errors'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'

import { MaybeNull } from 'app/interface/utils'

const createHttpError =
  (status: StatusCodes) =>
  (msg?: MaybeNull<string>, props?: Record<string, any>): HttpError => {
    const message = msg || getReasonPhrase(status)

    return props
      ? createError(status, message, props)
      : new createError[status](message)
  }

const checkHttpError =
  (status: StatusCodes) =>
  (error: any): boolean =>
    error instanceof createError[status]

export { createHttpError, checkHttpError }
