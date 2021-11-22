import { AppValidationError } from 'shared/utils/errors/appErrors'

const isValidationError = (error: unknown): boolean =>
  error instanceof AppValidationError

export default isValidationError
