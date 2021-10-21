import { Request, Response } from 'express'

import { UpdateImageDto } from 'modules/image/dto'
import { IdParam } from 'shared/dto'
import { ControllerResult } from 'shared/interface/response'

export interface IImageController {
  createOne: (req: Request, res: Response) => ControllerResult

  updateOne: (
    req: Request<Pick<IdParam, 'id'>, any, Pick<UpdateImageDto, 'fileName'>>,
    res: Response,
  ) => ControllerResult

  deleteOne: (
    req: Request<Pick<IdParam, 'id'>>,
    res: Response,
  ) => ControllerResult
}
