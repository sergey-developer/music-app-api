import { HttpError } from 'http-errors'

import {
  AppNotFoundError,
  AppUnknownError,
  AppValidationError,
} from 'shared/utils/errors/appErrors'
import {
  BadRequestError as HttpBadRequestError,
  NotFoundError as HttpNotFoundError,
  ServerError as HttpServerError,
} from 'shared/utils/errors/httpErrors'

export const getHttpErrorByAppError = (error: any): HttpError => {
  switch (error.name) {
    case AppNotFoundError.name:
      const notFoundError = error as AppNotFoundError

      return HttpNotFoundError(notFoundError.message)
    case AppValidationError.name:
      const validationError = error as AppValidationError

      return HttpBadRequestError(validationError.message, {
        kind: validationError.name,
        ...(validationError.errors && { errors: validationError.errors }),
      })
    case AppUnknownError.name:
      const unknownError = error as AppUnknownError

      return HttpServerError(unknownError.message)
    default:
      return HttpServerError()
  }
}
