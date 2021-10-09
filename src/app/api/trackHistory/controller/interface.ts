import { Request, Response } from 'express'

import {
  CreateTrackHistoryDto,
  DeleteOneTrackHistoryByIdParams,
} from 'api/trackHistory/dto'
import { ControllerResult } from 'shared/interface/response'

export interface ITrackHistoryController {
  getAll: (req: Request, res: Response) => ControllerResult

  createOne: (
    req: Request<any, any, CreateTrackHistoryDto>,
    res: Response,
  ) => ControllerResult

  deleteOneById: (
    req: Request<Pick<DeleteOneTrackHistoryByIdParams, 'id'>>,
    res: Response,
  ) => ControllerResult
}
