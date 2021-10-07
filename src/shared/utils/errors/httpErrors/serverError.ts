import createError from 'http-errors'
import StatusCodes from 'http-status-codes'

import { CheckHttpError, CreateHttpError } from 'shared/utils/errors/httpErrors'

const defaultMessage = StatusCodes.getStatusText(
  StatusCodes.INTERNAL_SERVER_ERROR,
)

const createServerError: CreateHttpError = (message, props) => {
  const msg = message || defaultMessage

  return props
    ? createError(StatusCodes.INTERNAL_SERVER_ERROR, msg, props)
    : new createError.InternalServerError(msg)
}

const isServerError: CheckHttpError = (error) =>
  error instanceof createError.InternalServerError

export { createServerError, isServerError }
