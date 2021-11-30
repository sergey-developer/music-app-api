import { Request, Response } from 'express'

import { IdParam } from 'app/dto'
import { ControllerResult } from 'app/interface/response'
import {
  CreateTrackDto,
  GetAllTracksQuery,
  UpdateTrackDto,
} from 'modules/track/dto'

export interface ITrackController {
  getAll: (
    req: Request<{}, any, any, GetAllTracksQuery>,
    res: Response,
  ) => ControllerResult

  getOne: (req: Request<Pick<IdParam, 'id'>>, res: Response) => ControllerResult

  createOne: (
    req: Request<any, any, CreateTrackDto>,
    res: Response,
  ) => ControllerResult

  updateOne: (
    req: Request<Pick<IdParam, 'id'>, any, UpdateTrackDto>,
    res: Response,
  ) => ControllerResult

  deleteOne: (
    req: Request<Pick<IdParam, 'id'>>,
    res: Response,
  ) => ControllerResult
}
