import { NextFunction, Request, Response } from 'express'

import { SessionService } from 'api/session/service'
import { verifyToken } from 'api/session/utils'
import { envConfig } from 'configs/env'
import { ServerError, UnauthorizedError } from 'shared/utils/errors/httpErrors'

const auth = async <Req extends Request, Res extends Response>(
  req: Req,
  res: Res,
  next: NextFunction,
) => {
  const token = req.signedCookies.token

  try {
    if (!token) {
      throw UnauthorizedError.create('Token was not provided')
    }

    const payload = verifyToken(token, envConfig.app.tokenSecret)
    const session = await SessionService.getOneByToken(token)

    if (!session) {
      throw UnauthorizedError.create()
    }

    req.user = payload
    next()
  } catch (error: any) {
    if (UnauthorizedError.verify(error)) {
      res.status(error.status).send(error)
      return
    }

    // TODO: handle error: invalid token

    const serverError = ServerError.create()
    res.status(serverError.status).send(serverError)
  }
}

export default auth
