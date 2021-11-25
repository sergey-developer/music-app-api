import { DatabaseUnknownError } from 'database/errors'

const isUnknownError = (error: unknown): boolean =>
  error instanceof DatabaseUnknownError

export default isUnknownError
