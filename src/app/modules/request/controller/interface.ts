import { Request, Response } from 'express'

import {
  DeleteOneRequestByIdParams,
  GetAllRequestsQuery,
} from 'modules/request/dto'
import { ControllerResult } from 'shared/interface/response'

export interface IRequestController {
  getAll: (
    req: Request<{}, any, any, GetAllRequestsQuery>,
    res: Response,
  ) => ControllerResult

  deleteOneById: (
    req: Request<Pick<DeleteOneRequestByIdParams, 'id'>>,
    res: Response,
  ) => ControllerResult
}
