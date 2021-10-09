import { StatusCodes } from 'http-status-codes'

import { checkHttpError, createHttpError } from 'shared/utils/errors/httpErrors'

const createBadRequestError = createHttpError(StatusCodes.BAD_REQUEST)
const isBadRequestError = checkHttpError(StatusCodes.BAD_REQUEST)

export { createBadRequestError, isBadRequestError }
