import createError from 'http-errors'
import StatusCodes from 'http-status-codes'

import { CheckHttpError, CreateHttpError } from 'shared/utils/errors/httpErrors'

const defaultMessage = StatusCodes.getStatusText(StatusCodes.UNAUTHORIZED)

const createUnauthorizedError: CreateHttpError = (message, props) => {
  const msg = message || defaultMessage

  return props
    ? createError(StatusCodes.UNAUTHORIZED, msg, props)
    : new createError.Unauthorized(msg)
}

const isUnauthorizedError: CheckHttpError = (error) =>
  error instanceof createError.Unauthorized

export { createUnauthorizedError, isUnauthorizedError }
