import { Request, Response } from 'express'

import { DeleteImageParams, UpdateImageParams } from 'modules/image/dto'
import { ControllerResult } from 'shared/interface/response'

export interface IImageController {
  createOne: (req: Request, res: Response) => ControllerResult

  update: (
    req: Request<Pick<UpdateImageParams, 'filename'>>,
    res: Response,
  ) => ControllerResult

  deleteOne: (
    req: Request<Pick<DeleteImageParams, 'filename'>>,
    res: Response,
  ) => ControllerResult
}
