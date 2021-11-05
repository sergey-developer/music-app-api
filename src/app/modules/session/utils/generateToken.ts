import jwt from 'jsonwebtoken'

import { JwtPayload, JwtToken } from 'modules/session/interface'

const generateToken = (payload: JwtPayload, secret: string): JwtToken => {
  return jwt.sign(payload, secret)
}

export default generateToken
