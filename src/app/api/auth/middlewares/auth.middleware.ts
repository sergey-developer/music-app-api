import { RequestHandler } from 'express'
import StatusCodes from 'http-status-codes'

import { SessionService } from 'api/session/service'
import { verifyToken } from 'api/session/utils'
import { envConfig } from 'configs/env'

const auth: RequestHandler = async (req, res, next) => {
  const token = req.signedCookies.token

  if (!token) {
    // TODO: handle error
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: StatusCodes.getStatusText(StatusCodes.UNAUTHORIZED) })
  }

  try {
    const payload = verifyToken(token, envConfig.app.tokenSecret)
    const session = await SessionService.getOneByToken(token)

    if (!session) {
      // TODO: handle error
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: StatusCodes.getStatusText(StatusCodes.UNAUTHORIZED) })
    }

    req.user = payload
    next()
  } catch (error) {
    // TODO: handle error: invalid token, no session
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: StatusCodes.getStatusText(StatusCodes.UNAUTHORIZED) })
  }
}

export default auth
