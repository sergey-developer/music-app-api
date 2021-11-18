import { JsonWebTokenError } from 'jsonwebtoken'

const isJwtError = (error: unknown): boolean =>
  error instanceof JsonWebTokenError

export default isJwtError
