import { AppNotFoundError } from 'shared/utils/errors/appErrors'

const isNotFoundError = (error: unknown): boolean =>
  error instanceof AppNotFoundError

export default isNotFoundError
