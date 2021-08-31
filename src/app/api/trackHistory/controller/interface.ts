import { Request, Response } from 'express'

import { CreateTrackHistoryDto } from 'api/trackHistory/dto'
import { ITrackHistoryDocumentArray } from 'api/trackHistory/interface'
import { ControllerResult, ResBody } from 'shared/interface/response'

export interface ITrackHistoryController {
  getAll: (
    req: Request,
    res: Response<ResBody<ITrackHistoryDocumentArray>>,
  ) => ControllerResult

  createOne: (
    req: Request<any, any, CreateTrackHistoryDto>,
    res: Response,
  ) => ControllerResult
}
