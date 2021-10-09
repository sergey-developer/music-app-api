import { HttpError } from 'http-errors'

import { isHttpError, serverError } from 'shared/utils/errors/httpErrors'

const ensureHttpError = (error: HttpError): HttpError => {
  return isHttpError(error) ? error : serverError()
}

export default ensureHttpError
