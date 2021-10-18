import { Request, Response } from 'express'

import { IdParam } from 'shared/dto'
import { ControllerResult } from 'shared/interface/response'

export interface IImageController {
  createOne: (req: Request, res: Response) => ControllerResult

  update: (req: Request<Pick<IdParam, 'id'>>, res: Response) => ControllerResult

  deleteOne: (
    req: Request<Pick<IdParam, 'id'>>,
    res: Response,
  ) => ControllerResult
}
