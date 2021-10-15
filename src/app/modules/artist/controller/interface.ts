import { Request, Response } from 'express'

import { CreateArtistDto, GetAllArtistsQuery } from 'modules/artist/dto'
import { IdParam } from 'shared/dto'
import { ControllerResult } from 'shared/interface/response'

export interface IArtistController {
  getAll: (
    req: Request<{}, any, any, GetAllArtistsQuery>,
    res: Response,
  ) => ControllerResult

  getOne: (req: Request<Pick<IdParam, 'id'>>, res: Response) => ControllerResult

  create: (
    req: Request<any, any, CreateArtistDto>,
    res: Response,
  ) => ControllerResult

  deleteOne: (
    req: Request<Pick<IdParam, 'id'>>,
    res: Response,
  ) => ControllerResult
}
