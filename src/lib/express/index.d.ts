import { JwtVerifyResult } from 'api/session/interface'

declare global {
  namespace Express {
    interface Request {
      user?: JwtVerifyResult
    }
  }
}
