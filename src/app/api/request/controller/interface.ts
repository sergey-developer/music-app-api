import { Request, Response } from 'express'

import { GetAllRequestsFilterDto } from 'api/request/dto'
import { RequestDocumentArray } from 'api/request/interface'
import { IRequestDocument } from 'api/request/model'
import { PickDocumentId } from 'database/interface/document'
import { ControllerResult, ResBody } from 'shared/interface/response'

export interface IRequestController {
  getAll: (
    req: Request<{}, any, any, GetAllRequestsFilterDto>,
    res: Response<ResBody<RequestDocumentArray>>,
  ) => ControllerResult
  deleteOneById: (
    req: Request<PickDocumentId<IRequestDocument>>,
    res: Response,
  ) => ControllerResult
}
