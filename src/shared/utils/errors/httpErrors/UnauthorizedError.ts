import createError from 'http-errors'
import StatusCodes from 'http-status-codes'

import { IHttpError } from 'shared/utils/errors/httpErrors'

const UnauthorizedError: IHttpError = {
  create: (
    message = StatusCodes.getStatusText(StatusCodes.UNAUTHORIZED),
    props,
  ) => {
    return props
      ? createError(StatusCodes.UNAUTHORIZED, message, props)
      : new createError.Unauthorized(message)
  },

  verify: (error) => error instanceof createError.Unauthorized,
}

export default UnauthorizedError
