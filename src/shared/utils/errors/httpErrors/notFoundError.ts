import createError from 'http-errors'
import StatusCodes from 'http-status-codes'

import { CheckHttpError, CreateHttpError } from 'shared/utils/errors/httpErrors'

const defaultMessage = StatusCodes.getStatusText(StatusCodes.NOT_FOUND)

const createNotFoundError: CreateHttpError = (message, props) => {
  const msg = message || defaultMessage

  return props
    ? createError(StatusCodes.NOT_FOUND, msg, props)
    : new createError.NotFound(msg)
}

const isNotFoundError: CheckHttpError = (error) =>
  error instanceof createError.NotFound

export { createNotFoundError, isNotFoundError }
