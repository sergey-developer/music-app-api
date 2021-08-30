import { Request, Response } from 'express'

import {
  SigninUserDto,
  SigninUserResultDto,
  SignupUserDto,
  SignupUserResultDto,
} from 'api/auth/dto'
import { ControllerResult, ResBody } from 'shared/interface/response'

export interface IAuthController {
  signup: (
    req: Request<any, any, SignupUserDto>,
    res: Response<ResBody<SignupUserResultDto>>,
  ) => ControllerResult
  signin: (
    req: Request<any, any, SigninUserDto>,
    res: Response<ResBody<SigninUserResultDto>>,
  ) => ControllerResult
}
