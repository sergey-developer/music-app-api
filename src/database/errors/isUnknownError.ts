import { UnknownError } from 'database/errors'

const isUnknownError = (error: unknown): boolean =>
  error instanceof UnknownError

export default isUnknownError
