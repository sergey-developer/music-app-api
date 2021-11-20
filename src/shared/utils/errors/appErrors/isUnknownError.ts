import { UnknownError } from 'shared/utils/errors/appErrors'

const isUnknownError = (error: unknown): boolean =>
  error instanceof UnknownError

export default isUnknownError
