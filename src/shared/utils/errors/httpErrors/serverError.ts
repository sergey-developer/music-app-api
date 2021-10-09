import { StatusCodes } from 'http-status-codes'

import { checkHttpError, createHttpError } from 'shared/utils/errors/httpErrors'

const serverError = createHttpError(StatusCodes.INTERNAL_SERVER_ERROR)
const isServerError = checkHttpError(StatusCodes.INTERNAL_SERVER_ERROR)

export { serverError, isServerError }
