import { Request, Response } from 'express'

import { IdParam } from 'app/dto'
import { ControllerResult } from 'app/interface/response'
import {
  CreateArtistDto,
  GetAllArtistsQuery,
  UpdateArtistDto,
} from 'modules/artist/dto'

export interface IArtistController {
  getAll: (
    req: Request<{}, any, any, GetAllArtistsQuery>,
    res: Response,
  ) => ControllerResult

  getOne: (req: Request<Pick<IdParam, 'id'>>, res: Response) => ControllerResult

  createOne: (
    req: Request<any, any, CreateArtistDto>,
    res: Response,
  ) => ControllerResult

  updateOne: (
    req: Request<Pick<IdParam, 'id'>, any, UpdateArtistDto>,
    res: Response,
  ) => ControllerResult

  deleteOne: (
    req: Request<Pick<IdParam, 'id'>>,
    res: Response,
  ) => ControllerResult
}
