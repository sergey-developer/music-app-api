import { JwtVerifyResult } from 'modules/session/interface'

declare global {
  namespace Express {
    interface Request {
      user?: JwtVerifyResult
    }
  }
}
