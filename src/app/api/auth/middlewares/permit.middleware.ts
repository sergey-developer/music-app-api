import { RequestHandler } from 'express'
import StatusCodes from 'http-status-codes'

import { UserRoleEnum } from 'api/user/interface'

const permit =
  (...roles: UserRoleEnum[]): RequestHandler =>
  (req, res, next) => {
    const user = req.user

    if (user && roles.includes(user.role)) {
      next()
    } else {
      res
        .status(StatusCodes.FORBIDDEN)
        .send({ message: StatusCodes.getStatusText(StatusCodes.FORBIDDEN) })
    }
  }

export default permit
