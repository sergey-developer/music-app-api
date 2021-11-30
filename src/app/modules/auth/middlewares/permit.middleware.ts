import { RequestHandler } from 'express'

import { UserRoleEnum } from 'modules/user/constants'
import {
  ForbiddenError,
  UnauthorizedError,
} from 'app/utils/errors/httpErrors'

const permit =
  (...roles: UserRoleEnum[]): RequestHandler =>
  (req, res, next) => {
    const user = req.user

    if (!user) {
      const error = UnauthorizedError('Unauthorized')
      res.status(error.status).send(error)
      return
    }

    if (!roles.includes(user.role)) {
      const error = ForbiddenError('No access')
      res.status(error.status).send(error)
      return
    }

    next()
  }

export default permit
