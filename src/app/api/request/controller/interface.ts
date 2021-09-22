import { Request, Response } from 'express'

import {
  DeleteOneRequestByIdParams,
  GetAllRequestsQuery,
} from 'api/request/dto'
import { IRequestDocumentArray } from 'api/request/interface'
import { ControllerResult, ResBody } from 'shared/interface/response'

export interface IRequestController {
  getAll: (
    req: Request<{}, any, any, GetAllRequestsQuery>,
    res: Response<ResBody<IRequestDocumentArray>>,
  ) => ControllerResult

  deleteOneById: (
    req: Request<Pick<DeleteOneRequestByIdParams, 'id'>>,
    res: Response,
  ) => ControllerResult
}
