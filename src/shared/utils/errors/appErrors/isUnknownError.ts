import { AppUnknownError } from 'shared/utils/errors/appErrors'

const isUnknownError = (error: unknown): boolean =>
  error instanceof AppUnknownError

export default isUnknownError
