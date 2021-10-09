import { HttpError } from 'http-errors'

import { createServerError, isHttpError } from 'shared/utils/errors/httpErrors'

const ensureHttpError = (error: HttpError): HttpError => {
  return isHttpError(error) ? error : createServerError()
}

export default ensureHttpError
