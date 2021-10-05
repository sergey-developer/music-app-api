import { Request, Response } from 'express'

import {
  CreateTrackDto,
  CreateTrackResultDto,
  DeleteOneTrackByIdParams,
  GetAllTracksQuery,
} from 'api/track/dto'
import { ITrackDocumentArray } from 'api/track/interface'
import { ControllerResult, ResBody } from 'shared/interface/response'

export interface ITrackController {
  getAll: (
    req: Request<{}, any, any, GetAllTracksQuery>,
    res: Response<ResBody<ITrackDocumentArray>>,
  ) => ControllerResult

  createOne: (
    req: Request<any, any, CreateTrackDto>,
    res: Response<ResBody<CreateTrackResultDto>>,
  ) => ControllerResult

  deleteOneById: (
    req: Request<Pick<DeleteOneTrackByIdParams, 'id'>>,
    res: Response,
  ) => ControllerResult
}
