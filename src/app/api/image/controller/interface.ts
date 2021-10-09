import { Request, Response } from 'express'

import { DeleteOneImageByIdParams } from 'api/image/dto'
import { ControllerResult } from 'shared/interface/response'

export interface IImageController {
  createOne: (req: Request, res: Response) => ControllerResult

  deleteOneById: (
    req: Request<Pick<DeleteOneImageByIdParams, 'id'>>,
    res: Response,
  ) => ControllerResult
}
