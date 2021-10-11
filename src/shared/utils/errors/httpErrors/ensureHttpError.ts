import { HttpError } from 'http-errors'

import { ServerError, isHttpError } from 'shared/utils/errors/httpErrors'

const ensureHttpError = (error: HttpError): HttpError => {
  return isHttpError(error) ? error : ServerError()
}

export default ensureHttpError
