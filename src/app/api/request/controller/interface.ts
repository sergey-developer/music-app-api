import { Request, Response } from 'express'

import { GetAllRequestsFilterDto } from 'api/request/dto'
import { RequestDocumentArray } from 'api/request/interface'
import { ReqQuery } from 'shared/interface/request'
import { ResBody } from 'shared/interface/response'

export interface IRequestController {
  getAll: (
    req: Request<{}, any, any, ReqQuery<GetAllRequestsFilterDto>>,
    res: Response<ResBody<RequestDocumentArray>>,
  ) => Promise<void>
}
