import { Request, Response } from 'express'

import {
  CreateArtistDto,
  CreateArtistResultDto,
  GetAllArtistsFilterDto,
} from 'api/artist/dto'
import { ReqQuery } from 'shared/interface/request'
import { ControllerResult, ResBody } from 'shared/interface/response'

export interface IArtistController {
  getAll: (
    req: Request<{}, any, any, ReqQuery<GetAllArtistsFilterDto>>,
    res: Response,
  ) => ControllerResult

  createOne: (
    req: Request<any, any, CreateArtistDto>,
    res: Response<ResBody<CreateArtistResultDto>>,
  ) => ControllerResult
}
