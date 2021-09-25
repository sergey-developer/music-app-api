import createError from 'http-errors'
import StatusCodes from 'http-status-codes'

import { IHttpError } from 'shared/utils/errors/httpErrors'

const NotFoundError: IHttpError = {
  create: (
    message = StatusCodes.getStatusText(StatusCodes.NOT_FOUND),
    props,
  ) => {
    return props
      ? createError(StatusCodes.NOT_FOUND, message, props)
      : new createError.NotFound(message)
  },

  verify: (error) => error instanceof createError.NotFound,
}

export default NotFoundError
