import { Request, Response } from 'express'

import { CreateTrackDto, GetAllTracksQuery } from 'modules/track/dto'
import { IdParam } from 'shared/dto'
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
    req: Request<Pick<IdParam, 'id'>>,
    res: Response,
  ) => ControllerResult
}
