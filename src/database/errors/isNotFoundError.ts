import { NotFoundError } from 'database/errors'

const isNotFoundError = (error: unknown): boolean =>
  error instanceof NotFoundError

export default isNotFoundError
