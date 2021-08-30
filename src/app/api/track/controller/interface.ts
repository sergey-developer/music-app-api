import { Request, Response } from 'express'

import {
  CreateTrackDto,
  CreateTrackResultDto,
  GetAllTracksFilterDto,
} from 'api/track/dto'
import { TrackDocumentArray } from 'api/track/interface'
import { ReqQuery } from 'shared/interface/request'
import { ResBody } from 'shared/interface/response'

export interface ITrackController {
  getAll: (
    req: Request<{}, any, any, ReqQuery<GetAllTracksFilterDto>>,
    res: Response<ResBody<TrackDocumentArray>>,
  ) => Promise<void>

  createOne: (
    req: Request<any, any, CreateTrackDto>,
    res: Response<ResBody<CreateTrackResultDto>>,
  ) => Promise<void>
}
