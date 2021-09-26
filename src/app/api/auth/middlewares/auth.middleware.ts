import { NextFunction, Request, Response } from 'express'

import { SessionService } from 'api/session/service'
import { verifyToken } from 'api/session/utils'
import { envConfig } from 'configs/env'
import {
  createServerError,
  createUnauthorizedError,
  isUnauthorizedError,
} from 'shared/utils/errors/httpErrors'

const auth = async <Req extends Request, Res extends Response>(
  req: Req,
  res: Res,
  next: NextFunction,
) => {
  const token = req.signedCookies.token

  try {
    if (!token) {
      throw createUnauthorizedError('Token was not provided')
    }

    const payload = verifyToken(token, envConfig.app.tokenSecret)
    const session = await SessionService.getOneByToken(token)

    if (!session) {
      throw createUnauthorizedError()
    }

    req.user = payload
    next()
  } catch (error: any) {
    if (isUnauthorizedError(error)) {
      res.status(error.status).send(error)
      return
    }

    // TODO: handle error: invalid token

    const serverError = createServerError()
    res.status(serverError.status).send(serverError)
  }
}

export default auth
