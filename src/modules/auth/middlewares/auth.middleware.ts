import { NextFunction, Request, Response } from 'express'
import set from 'lodash/set'

import { envConfig } from 'configs/env'
import { SessionService } from 'modules/session/service'
import { isJwtError, verifyToken } from 'modules/session/utils'
import {
  UnauthorizedError,
  ensureHttpError,
} from 'shared/utils/errors/httpErrors'

const auth = async <Req extends Request, Res extends Response>(
  req: Req,
  res: Res,
  next: NextFunction,
) => {
  try {
    // TODO: set type for cookies
    const token = req.cookies.token

    if (!token) throw UnauthorizedError('Token was not provided')

    const jwtPayload = verifyToken(token, envConfig.app.tokenSecret)

    await SessionService.getOneByToken(token)

    set(req, 'user', jwtPayload)
    next()
  } catch (exception) {
    let error

    if (isJwtError(exception)) {
      error = UnauthorizedError('Invalid token')
      res.status(error.status).send(error)
      return
    }

    error = ensureHttpError(exception)
    res.status(error.status).send(error)
    return
  }
}

export default auth
