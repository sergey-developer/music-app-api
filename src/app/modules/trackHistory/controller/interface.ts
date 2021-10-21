import { Request, Response } from 'express'

import { CreateTrackHistoryDto } from 'modules/trackHistory/dto'
import { IdParam } from 'shared/dto'
import { ControllerResult } from 'shared/interface/response'

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
