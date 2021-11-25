import { DatabaseNotFoundError } from 'database/errors'

const isNotFoundError = (error: unknown): boolean =>
  error instanceof DatabaseNotFoundError

export default isNotFoundError
