import { NextFunction, Request, Response } from 'express'
import set from 'lodash/set'

import { isJwtError } from 'api/auth/utils'
import { SessionService } from 'api/session/service'
import { verifyToken } from 'api/session/utils'
import { envConfig } from 'configs/env'
import {
  ensureHttpError,
  unauthorizedError,
} from 'shared/utils/errors/httpErrors'

const auth = async <Req extends Request, Res extends Response>(
  req: Req,
  res: Res,
  next: NextFunction,
) => {
  try {
    // TODO: set type for cookies
    const token = req.cookies.token

    if (!token) throw unauthorizedError('Token was not provided')

    const jwtPayload = verifyToken(token, envConfig.app.tokenSecret)

    await SessionService.getOneByToken(token)

    set(req, 'user', jwtPayload)
    next()
  } catch (exception) {
    let error

    if (isJwtError(exception)) {
      error = unauthorizedError('Invalid token')
      res.status(error.status).send(error)
      return
    }

    error = ensureHttpError(exception)
    res.status(error.status).send(error)
    return
  }
}

export default auth
