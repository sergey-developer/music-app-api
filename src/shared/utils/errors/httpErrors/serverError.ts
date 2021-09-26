import createError from 'http-errors'
import StatusCodes from 'http-status-codes'

import { CheckHttpError, CreateHttpError } from 'shared/utils/errors/httpErrors'

const createServerError: CreateHttpError = (
  message = StatusCodes.getStatusText(StatusCodes.INTERNAL_SERVER_ERROR),
  props,
) => {
  return props
    ? createError(StatusCodes.INTERNAL_SERVER_ERROR, message, props)
    : new createError.InternalServerError(message)
}

const isServerError: CheckHttpError = (error) =>
  error instanceof createError.InternalServerError

export { createServerError, isServerError }
