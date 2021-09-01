import { Request, Response } from 'express'

import {
  CreateArtistDto,
  CreateArtistResultDto,
  GetAllArtistsQuery,
} from 'api/artist/dto'
import { ControllerResult, ResBody } from 'shared/interface/response'

export interface IArtistController {
  getAll: (
    req: Request<{}, any, any, GetAllArtistsQuery>,
    res: Response,
  ) => ControllerResult

  createOne: (
    req: Request<any, any, CreateArtistDto>,
    res: Response<ResBody<CreateArtistResultDto>>,
  ) => ControllerResult
}
