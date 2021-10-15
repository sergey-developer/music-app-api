import { Request, Response } from 'express'

import {
  CreateAlbumDto,
  DeleteAlbumParams,
  GetAlbumParams,
  GetAllAlbumsQuery,
  UpdateAlbumDto,
  UpdateAlbumParams,
} from 'modules/album/dto'
import { ControllerResult } from 'shared/interface/response'

export interface IAlbumController {
  getAll: (
    req: Request<{}, any, any, GetAllAlbumsQuery>,
    res: Response,
  ) => ControllerResult

  getOne: (
    req: Request<Pick<GetAlbumParams, 'id'>>,
    res: Response,
  ) => ControllerResult

  create: (
    req: Request<{}, any, CreateAlbumDto>,
    res: Response,
  ) => ControllerResult

  update: (
    req: Request<Pick<UpdateAlbumParams, 'id'>, any, UpdateAlbumDto>,
    res: Response,
  ) => ControllerResult

  deleteOne: (
    req: Request<Pick<DeleteAlbumParams, 'id'>>,
    res: Response,
  ) => ControllerResult
}
