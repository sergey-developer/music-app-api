import createError from 'http-errors'
import StatusCodes from 'http-status-codes'

import { IHttpError } from 'shared/utils/errors/httpErrors'

const BadRequestError: IHttpError = {
  create: (
    message = StatusCodes.getStatusText(StatusCodes.BAD_REQUEST),
    props,
  ) => {
    return props
      ? createError(StatusCodes.BAD_REQUEST, message, props)
      : new createError.BadRequest(message)
  },

  verify: (error) => error instanceof createError.BadRequest,
}

export default BadRequestError
