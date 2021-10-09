import { StatusCodes } from 'http-status-codes'

import { checkHttpError, createHttpError } from 'shared/utils/errors/httpErrors'

const createServerError = createHttpError(StatusCodes.INTERNAL_SERVER_ERROR)
const isServerError = checkHttpError(StatusCodes.INTERNAL_SERVER_ERROR)

export { createServerError, isServerError }
