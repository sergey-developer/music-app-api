import { Request, Response } from 'express'

import { IdParam } from 'app/dto'
import { ControllerResult } from 'app/interface/response'
import {
  CreateAlbumDto,
  GetAllAlbumsQuery,
  UpdateAlbumDto,
} from 'modules/album/dto'

export interface IAlbumController {
  getAll: (
    req: Request<{}, any, any, GetAllAlbumsQuery>,
    res: Response,
  ) => ControllerResult

  getOne: (req: Request<Pick<IdParam, 'id'>>, res: Response) => ControllerResult

  createOne: (
    req: Request<{}, any, CreateAlbumDto>,
    res: Response,
  ) => ControllerResult

  updateOne: (
    req: Request<Pick<IdParam, 'id'>, any, UpdateAlbumDto>,
    res: Response,
  ) => ControllerResult

  deleteOne: (
    req: Request<Pick<IdParam, 'id'>>,
    res: Response,
  ) => ControllerResult
}
