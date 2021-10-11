import { Request, Response } from 'express'

import { SigninUserDto, SignupUserDto } from 'modules/auth/dto'
import { ControllerResult } from 'shared/interface/response'

export interface IAuthController {
  signup: (
    req: Request<any, any, SignupUserDto>,
    res: Response,
  ) => ControllerResult

  signin: (
    req: Request<any, any, SigninUserDto>,
    res: Response,
  ) => ControllerResult
}
