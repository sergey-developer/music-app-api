import { sign } from 'jsonwebtoken'

import { JwtPayload, JwtToken } from 'modules/session/interface'

const generateToken = (payload: JwtPayload, secret: string): JwtToken => {
  return sign(payload, secret)
}

export default generateToken
