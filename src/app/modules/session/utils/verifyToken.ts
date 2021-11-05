import jwt from 'jsonwebtoken'

import { JwtToken, JwtVerifyResult } from 'modules/session/interface'

const verifyToken = (token: JwtToken, secret: string): JwtVerifyResult => {
  return jwt.verify(token, secret) as JwtVerifyResult
}

export default verifyToken
