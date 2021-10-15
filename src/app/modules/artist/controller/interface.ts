import { Request, Response } from 'express'

import {
  CreateArtistDto,
  DeleteArtistParams,
  GetAllArtistsQuery,
  GetArtistParams,
} from 'modules/artist/dto'
import { ControllerResult } from 'shared/interface/response'

export interface IArtistController {
  getAll: (
    req: Request<{}, any, any, GetAllArtistsQuery>,
    res: Response,
  ) => ControllerResult

  getOne: (
    req: Request<Pick<GetArtistParams, 'id'>>,
    res: Response,
  ) => ControllerResult

  create: (
    req: Request<any, any, CreateArtistDto>,
    res: Response,
  ) => ControllerResult

  deleteOne: (
    req: Request<Pick<DeleteArtistParams, 'id'>>,
    res: Response,
  ) => ControllerResult
}
