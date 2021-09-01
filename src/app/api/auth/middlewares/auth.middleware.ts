import { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'

import { SessionService } from 'api/session/service'
import { verifyToken } from 'api/session/utils'
import { envConfig } from 'configs/env'

const unauthorizedError = new createError.Unauthorized()

const auth = async <Req extends Request, Res extends Response>(
  req: Req,
  res: Res,
  next: NextFunction,
) => {
  const token = req.signedCookies.token

  try {
    if (!token) {
      throw unauthorizedError
    }

    const payload = verifyToken(token, envConfig.app.tokenSecret)
    const session = await SessionService.getOneByToken(token)

    if (!session) {
      throw unauthorizedError
    }

    req.user = payload
    next()
  } catch (error) {
    if (error instanceof createError.Unauthorized) {
      res.status(error.status).send(error)
    }

    // TODO: handle error: invalid token

    const serverError = createError()
    res.status(serverError.status).send(serverError)
  }
}

export default auth
