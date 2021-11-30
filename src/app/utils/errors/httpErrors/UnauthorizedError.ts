import { StatusCodes } from 'http-status-codes'

import { checkHttpError, createHttpError } from 'app/utils/errors/httpErrors'

const UnauthorizedError = createHttpError(StatusCodes.UNAUTHORIZED)
const isUnauthorizedError = checkHttpError(StatusCodes.UNAUTHORIZED)

export { UnauthorizedError, isUnauthorizedError }
