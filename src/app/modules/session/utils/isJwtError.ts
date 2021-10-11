import { JsonWebTokenError } from 'jsonwebtoken'

const isJwtError = (error: any): boolean => error instanceof JsonWebTokenError

export default isJwtError
