import { Request, Response } from 'express'

import { CreateImageResultDto, DeleteOneImageByIdParams } from 'api/image/dto'
import { ControllerResult, ResBody } from 'shared/interface/response'

export interface IImageController {
  createOne: (
    req: Request,
    res: Response<ResBody<CreateImageResultDto>>,
  ) => ControllerResult

  deleteOneById: (
    req: Request<Pick<DeleteOneImageByIdParams, 'id'>>,
    res: Response,
  ) => ControllerResult
}
