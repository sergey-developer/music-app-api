import { Request, Response } from 'express'

import {
  CreateTrackDto,
  DeleteTrackParams,
  GetAllTracksQuery,
} from 'modules/track/dto'
import { ControllerResult } from 'shared/interface/response'

export interface ITrackController {
  getAll: (
    req: Request<{}, any, any, GetAllTracksQuery>,
    res: Response,
  ) => ControllerResult

  create: (
    req: Request<any, any, CreateTrackDto>,
    res: Response,
  ) => ControllerResult

  deleteOne: (
    req: Request<Pick<DeleteTrackParams, 'id'>>,
    res: Response,
  ) => ControllerResult
}
