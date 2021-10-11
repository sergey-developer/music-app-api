import { Request, Response } from 'express'

import {
  CreateArtistDto,
  DeleteOneArtistByIdParams,
  GetAllArtistsQuery,
} from 'modules/artist/dto'
import { ControllerResult } from 'shared/interface/response'

export interface IArtistController {
  getAll: (
    req: Request<{}, any, any, GetAllArtistsQuery>,
    res: Response,
  ) => ControllerResult

  createOne: (
    req: Request<any, any, CreateArtistDto>,
    res: Response,
  ) => ControllerResult

  deleteOneById: (
    req: Request<Pick<DeleteOneArtistByIdParams, 'id'>>,
    res: Response,
  ) => ControllerResult
}
