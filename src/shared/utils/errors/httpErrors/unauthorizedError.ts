import { StatusCodes } from 'http-status-codes'

import { checkHttpError, createHttpError } from 'shared/utils/errors/httpErrors'

const createUnauthorizedError = createHttpError(StatusCodes.UNAUTHORIZED)
const isUnauthorizedError = checkHttpError(StatusCodes.UNAUTHORIZED)

export { createUnauthorizedError, isUnauthorizedError }
