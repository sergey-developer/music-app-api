import { Request, Response } from 'express'

import { IdParam } from 'app/dto'
import { ControllerResult } from 'app/interface/response'
import { GetAllRequestsQuery, UpdateRequestDto } from 'modules/request/dto'

export interface IRequestController {
  getAll: (
    req: Request<{}, any, any, GetAllRequestsQuery>,
    res: Response,
  ) => ControllerResult

  updateOne: (
    req: Request<Pick<IdParam, 'id'>, any, UpdateRequestDto>,
    res: Response,
  ) => ControllerResult

  deleteOne: (
    req: Request<Pick<IdParam, 'id'>>,
    res: Response,
  ) => ControllerResult
}
