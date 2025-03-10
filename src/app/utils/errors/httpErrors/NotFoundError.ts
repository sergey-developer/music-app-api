import { StatusCodes } from 'http-status-codes'

import { checkHttpError, createHttpError } from 'app/utils/errors/httpErrors'

const NotFoundError = createHttpError(StatusCodes.NOT_FOUND)
const isNotFoundError = checkHttpError(StatusCodes.NOT_FOUND)

export { NotFoundError, isNotFoundError }
