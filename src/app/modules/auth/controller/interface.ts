import { Request, Response } from 'express'

import { ControllerResult } from 'app/interface/response'
import { SigninUserDto, SignupUserDto } from 'modules/auth/dto'

export interface IAuthController {
  signin: (
    req: Request<any, any, SigninUserDto>,
    res: Response,
  ) => ControllerResult

  signup: (
    req: Request<any, any, SignupUserDto>,
    res: Response,
  ) => ControllerResult

  logout: (req: Request, res: Response) => ControllerResult
}
