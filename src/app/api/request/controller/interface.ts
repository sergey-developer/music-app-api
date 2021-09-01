import { Request, Response } from 'express'

import { GetAllRequestsQuery } from 'api/request/dto'
import { RequestDocumentArray } from 'api/request/interface'
import { ControllerResult, ResBody } from 'shared/interface/response'
import { IdParam } from 'shared/utils/validation'

export interface IRequestController {
  getAll: (
    req: Request<{}, any, any, GetAllRequestsQuery>,
    res: Response<ResBody<RequestDocumentArray>>,
  ) => ControllerResult

  deleteOneById: (
    req: Request<Pick<IdParam, 'id'>>,
    res: Response,
  ) => ControllerResult
}
