import { JwtPayload } from 'api/session/interface'

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}
