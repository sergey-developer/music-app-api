import createError from 'http-errors'
import StatusCodes from 'http-status-codes'

import { CheckHttpError, CreateHttpError } from 'shared/utils/errors/httpErrors'

const defaultMessage = StatusCodes.getStatusText(StatusCodes.BAD_REQUEST)

const createBadRequestError: CreateHttpError = (message, props) => {
  const msg = message || defaultMessage

  return props
    ? createError(StatusCodes.BAD_REQUEST, msg, props)
    : new createError.BadRequest(msg)
}

const isBadRequestError: CheckHttpError = (error) =>
  error instanceof createError.BadRequest

export { createBadRequestError, isBadRequestError }
