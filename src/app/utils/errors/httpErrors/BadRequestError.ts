import { StatusCodes } from 'http-status-codes'

import { checkHttpError, createHttpError } from 'app/utils/errors/httpErrors'

const BadRequestError = createHttpError(StatusCodes.BAD_REQUEST)
const isBadRequestError = checkHttpError(StatusCodes.BAD_REQUEST)

export { BadRequestError, isBadRequestError }
