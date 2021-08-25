import jwt from 'jsonwebtoken'

import { JwtToken, JwtVerifyResult } from 'api/session/interface'
import { envConfig } from 'configs/env'

const secret = envConfig.app.tokenSecret

export default (token: JwtToken): JwtVerifyResult => {
  return jwt.verify(token, secret)
}
