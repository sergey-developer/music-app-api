import { HttpError } from 'http-errors'

import { createServerError, isHttpError } from 'shared/utils/errors/httpErrors'

const ensureHttpError = (
  error: HttpError,
  defaultError = createServerError,
): HttpError => {
  return isHttpError(error) ? error : defaultError()
}

export default ensureHttpError
