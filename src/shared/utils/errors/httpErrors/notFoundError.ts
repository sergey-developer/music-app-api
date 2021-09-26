import createError from 'http-errors'
import StatusCodes from 'http-status-codes'

import { CheckHttpError, CreateHttpError } from 'shared/utils/errors/httpErrors'

const createNotFoundError: CreateHttpError = (
  message = StatusCodes.getStatusText(StatusCodes.NOT_FOUND),
  props,
) => {
  return props
    ? createError(StatusCodes.NOT_FOUND, message, props)
    : new createError.NotFound(message)
}

const isNotFoundError: CheckHttpError = (error) =>
  error instanceof createError.NotFound

export { createNotFoundError, isNotFoundError }
