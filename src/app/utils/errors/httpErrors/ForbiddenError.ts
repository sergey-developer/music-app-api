import { StatusCodes } from 'http-status-codes'

import { checkHttpError, createHttpError } from 'app/utils/errors/httpErrors'

const ForbiddenError = createHttpError(StatusCodes.FORBIDDEN)
const isForbiddenError = checkHttpError(StatusCodes.FORBIDDEN)

export { ForbiddenError, isForbiddenError }
