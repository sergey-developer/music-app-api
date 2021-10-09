import { StatusCodes } from 'http-status-codes'

import { checkHttpError, createHttpError } from 'shared/utils/errors/httpErrors'

const unauthorizedError = createHttpError(StatusCodes.UNAUTHORIZED)
const isUnauthorizedError = checkHttpError(StatusCodes.UNAUTHORIZED)

export { unauthorizedError, isUnauthorizedError }
