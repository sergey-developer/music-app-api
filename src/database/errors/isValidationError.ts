import { ValidationError } from 'database/errors'

const isValidationError = (error: unknown): boolean =>
  error instanceof ValidationError

export default isValidationError
