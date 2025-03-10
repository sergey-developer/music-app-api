import { AppNotFoundError } from 'app/utils/errors/appErrors'

const isNotFoundError = (error: unknown): boolean =>
  error instanceof AppNotFoundError

export default isNotFoundError
