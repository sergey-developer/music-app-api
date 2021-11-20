import { NotFoundError } from 'shared/utils/errors/appErrors'

const isNotFoundError = (error: unknown): boolean =>
  error instanceof NotFoundError

export default isNotFoundError
