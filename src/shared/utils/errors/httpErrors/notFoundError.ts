import { StatusCodes } from 'http-status-codes'

import { checkHttpError, createHttpError } from 'shared/utils/errors/httpErrors'

const notFoundError = createHttpError(StatusCodes.NOT_FOUND)
const isNotFoundError = checkHttpError(StatusCodes.NOT_FOUND)

export { notFoundError, isNotFoundError }
