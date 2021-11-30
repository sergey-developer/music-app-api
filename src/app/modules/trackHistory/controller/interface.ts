import { Request, Response } from 'express'

import { IdParam } from 'app/dto'
import { ControllerResult } from 'app/interface/response'
import { CreateTrackHistoryDto } from 'modules/trackHistory/dto'

export interface ITrackHistoryController {
  getAll: (req: Request, res: Response) => ControllerResult

  createOne: (
    req: Request<any, any, CreateTrackHistoryDto>,
    res: Response,
  ) => ControllerResult

  deleteOne: (
    req: Request<Pick<IdParam, 'id'>>,
    res: Response,
  ) => ControllerResult
}
