import { Request, Response } from 'express'

import { DeleteRequestParams, GetAllRequestsQuery } from 'modules/request/dto'
import { ControllerResult } from 'shared/interface/response'

export interface IRequestController {
  getAll: (
    req: Request<{}, any, any, GetAllRequestsQuery>,
    res: Response,
  ) => ControllerResult

  deleteOne: (
    req: Request<Pick<DeleteRequestParams, 'id'>>,
    res: Response,
  ) => ControllerResult
}
