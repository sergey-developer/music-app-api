import createError from 'http-errors'
import StatusCodes from 'http-status-codes'

import { CheckHttpError, CreateHttpError } from 'shared/utils/errors/httpErrors'

const createUnauthorizedError: CreateHttpError = (
  message = StatusCodes.getStatusText(StatusCodes.UNAUTHORIZED),
  props,
) => {
  return props
    ? createError(StatusCodes.UNAUTHORIZED, message, props)
    : new createError.Unauthorized(message)
}

const isUnauthorizedError: CheckHttpError = (error) =>
  error instanceof createError.Unauthorized

export { createUnauthorizedError, isUnauthorizedError }
