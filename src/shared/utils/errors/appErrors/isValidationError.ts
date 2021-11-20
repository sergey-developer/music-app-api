import { ValidationError } from 'shared/utils/errors/appErrors'

const isValidationError = (error: unknown): boolean =>
  error instanceof ValidationError

export default isValidationError
