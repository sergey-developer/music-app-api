import jwt from 'jsonwebtoken'

import { JwtPayload, JwtToken } from 'api/session/interface'

export default (payload: JwtPayload, secret: string): JwtToken => {
  return jwt.sign(payload, secret)
}
