import { RequestHandler } from 'express'

import { UserRoleEnum } from 'api/user/interface'
import {
  forbiddenError,
  unauthorizedError,
} from 'shared/utils/errors/httpErrors'

const permit =
  (...roles: UserRoleEnum[]): RequestHandler =>
  (req, res, next) => {
    const user = req.user

    if (!user) {
      const error = unauthorizedError()
      res.status(error.status).send(error)
      return
    }

    if (roles.includes(user.role)) {
      next()
    } else {
      const error = forbiddenError('No access')
      res.status(error.status).send(error)
    }
  }

export default permit
