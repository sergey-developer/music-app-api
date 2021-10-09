import { Request, Response } from 'express'

import {
  CreateTrackDto,
  DeleteOneTrackByIdParams,
  GetAllTracksQuery,
} from 'api/track/dto'
import { ControllerResult } from 'shared/interface/response'

export interface ITrackController {
  getAll: (
    req: Request<{}, any, any, GetAllTracksQuery>,
    res: Response,
  ) => ControllerResult

  createOne: (
    req: Request<any, any, CreateTrackDto>,
    res: Response,
  ) => ControllerResult

  deleteOneById: (
    req: Request<Pick<DeleteOneTrackByIdParams, 'id'>>,
    res: Response,
  ) => ControllerResult
}
