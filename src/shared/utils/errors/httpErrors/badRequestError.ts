import createError from 'http-errors'
import StatusCodes from 'http-status-codes'

import { CheckHttpError, CreateHttpError } from 'shared/utils/errors/httpErrors'

const createBadRequestError: CreateHttpError = (
  message = StatusCodes.getStatusText(StatusCodes.BAD_REQUEST),
  props,
) => {
  return props
    ? createError(StatusCodes.BAD_REQUEST, message, props)
    : new createError.BadRequest(message)
}

const isBadRequestError: CheckHttpError = (error) =>
  error instanceof createError.BadRequest

export { createBadRequestError, isBadRequestError }
