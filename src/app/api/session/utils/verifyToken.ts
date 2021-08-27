import jwt from 'jsonwebtoken'

import { JwtToken, JwtVerifyResult } from 'api/session/interface'

export default (token: JwtToken, secret: string): JwtVerifyResult => {
  return jwt.verify(token, secret) as JwtVerifyResult
}
