import createError from 'http-errors'
import StatusCodes from 'http-status-codes'

import { IHttpError } from 'shared/utils/errors/httpErrors'

const ServerError: IHttpError = {
  create: (
    message = StatusCodes.getStatusText(StatusCodes.INTERNAL_SERVER_ERROR),
    props,
  ) => {
    return props
      ? createError(StatusCodes.INTERNAL_SERVER_ERROR, message, props)
      : new createError.InternalServerError(message)
  },

  verify: (error) => error instanceof createError.InternalServerError,
}

export default ServerError
