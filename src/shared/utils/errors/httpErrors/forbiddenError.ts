import { StatusCodes } from 'http-status-codes'

import { checkHttpError, createHttpError } from 'shared/utils/errors/httpErrors'

const forbiddenError = createHttpError(StatusCodes.FORBIDDEN)
const isForbiddenError = checkHttpError(StatusCodes.FORBIDDEN)

export { forbiddenError, isForbiddenError }
