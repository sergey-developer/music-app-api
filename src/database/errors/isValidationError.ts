import { DatabaseValidationError } from 'database/errors'

const isValidationError = (error: unknown): boolean =>
  error instanceof DatabaseValidationError

export default isValidationError
