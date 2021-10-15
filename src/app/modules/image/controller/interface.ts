import { Request, Response } from 'express'

import { DeleteImageParams } from 'modules/image/dto'
import { ControllerResult } from 'shared/interface/response'

export interface IImageController {
  createOne: (req: Request, res: Response) => ControllerResult

  deleteOne: (
    req: Request<Pick<DeleteImageParams, 'id'>>,
    res: Response,
  ) => ControllerResult
}
