import { Request, Response } from 'express'

import {
  CreateTrackDto,
  CreateTrackResultDto,
  GetAllTracksFilterDto,
} from 'api/track/dto'
import { TrackDocumentArray } from 'api/track/interface'
import { ControllerResult, ResBody } from 'shared/interface/response'

export interface ITrackController {
  getAll: (
    req: Request<{}, any, any, GetAllTracksFilterDto>,
    res: Response<ResBody<TrackDocumentArray>>,
  ) => ControllerResult

  createOne: (
    req: Request<any, any, CreateTrackDto>,
    res: Response<ResBody<CreateTrackResultDto>>,
  ) => ControllerResult
}
