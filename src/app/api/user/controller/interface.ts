import { Request, Response } from 'express'

import { CreateUserDto, CreateUserResultDto } from 'api/user/dto'
import { ResBody } from 'shared/interface/response'

export interface IUserController {
  create: (
    req: Request<any, any, CreateUserDto>,
    res: Response<ResBody<CreateUserResultDto>>,
  ) => Promise<void>
}
