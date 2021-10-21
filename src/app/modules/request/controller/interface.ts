import { Request, Response } from 'express'

import { GetAllRequestsQuery, UpdateRequestDto } from 'modules/request/dto'
import { IdParam } from 'shared/dto'
import { ControllerResult } from 'shared/interface/response'

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
