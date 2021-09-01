import { Request, Response } from 'express'

import { CreateImageResultDto } from 'api/image/dto'
import { ControllerResult, ResBody } from 'shared/interface/response'
import { IdParam } from 'shared/utils/validation'

export interface IImageController {
  createOne: (
    req: Request,
    res: Response<ResBody<CreateImageResultDto>>,
  ) => ControllerResult

  deleteOneById: (
    req: Request<Pick<IdParam, 'id'>>,
    res: Response,
  ) => ControllerResult
}
