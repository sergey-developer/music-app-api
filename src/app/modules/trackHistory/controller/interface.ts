import { Request, Response } from 'express'

import {
  CreateTrackHistoryDto,
  DeleteTrackHistoryParams,
} from 'modules/trackHistory/dto'
import { ControllerResult } from 'shared/interface/response'

export interface ITrackHistoryController {
  getAll: (req: Request, res: Response) => ControllerResult

  create: (
    req: Request<any, any, CreateTrackHistoryDto>,
    res: Response,
  ) => ControllerResult

  deleteOne: (
    req: Request<Pick<DeleteTrackHistoryParams, 'id'>>,
    res: Response,
  ) => ControllerResult
}
