import config from 'config'
import { NextFunction, Request, Response } from 'express'
import { container as DiContainer } from 'tsyringe'

import { SessionService } from 'modules/session/service'
import { isJwtError, verifyToken } from 'modules/session/utils'
import { AppError } from 'shared/utils/errors/appErrors'
import { ServerError, UnauthorizedError } from 'shared/utils/errors/httpErrors'

const sessionService = DiContainer.resolve(SessionService)

const auth = async <Req extends Request, Res extends Response>(
  req: Req,
  res: Res,
  next: NextFunction,
) => {
  // TODO: set type for cookies
  const token = req.cookies.token

  if (!token) {
    const httpError = UnauthorizedError('Token was not provided')
    res.status(httpError.status).send(httpError)
    return
  }

  let jwtPayload

  try {
    const tokenSecret: string = config.get('app.secrets.tokenSecret')
    jwtPayload = verifyToken(token, tokenSecret)
  } catch (error) {
    if (isJwtError(error)) {
      const httpError = UnauthorizedError('Invalid token')
      res.status(httpError.status).send(httpError)
      return
    }

    const httpError = ServerError()
    res.status(httpError.status).send(httpError)
    return
  }

  try {
    const session = await sessionService.getOneByToken(token)

    if (session) {
      req.user = jwtPayload
      next()
    }

    const httpError = UnauthorizedError()
    res.status(httpError.status).send(httpError)
  } catch (error) {
    if (error instanceof AppError.NotFoundError) {
      const httpError = UnauthorizedError()
      res.status(httpError.status).send(httpError)
      return
    }

    const httpError = ServerError()
    res.status(httpError.status).send(httpError)
  }
}

export default auth
