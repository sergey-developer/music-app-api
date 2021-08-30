import { Request, Response } from 'express'

import {
  CreateArtistDto,
  CreateArtistResultDto,
  GetAllArtistsFilterDto,
} from 'api/artist/dto'
import { ReqQuery } from 'shared/interface/request'
import { ResBody } from 'shared/interface/response'

export interface IArtistController {
  getAll: (
    req: Request<{}, any, any, ReqQuery<GetAllArtistsFilterDto>>,
    res: Response,
  ) => Promise<void>

  createOne: (
    req: Request<any, any, CreateArtistDto>,
    res: Response<ResBody<CreateArtistResultDto>>,
  ) => Promise<void>
}
