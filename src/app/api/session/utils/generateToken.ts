import jwt from 'jsonwebtoken'

import { JwtPayload, JwtToken } from 'api/session/interface'
import { envConfig } from 'configs/env'

const secret = envConfig.app.tokenSecret

export default (payload: JwtPayload): JwtToken => {
  return jwt.sign(payload, secret)
}
