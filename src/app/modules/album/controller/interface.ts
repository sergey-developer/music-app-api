import { Request, Response } from 'express'

import {
  CreateAlbumDto,
  DeleteOneAlbumByIdParams,
  GetAllAlbumsQuery,
  GetOneAlbumByIdParams,
  UpdateAlbumByIdParams,
  UpdateAlbumDto,
} from 'modules/album/dto'
import { ControllerResult } from 'shared/interface/response'

export interface IAlbumController {
  getAll: (
    req: Request<{}, any, any, GetAllAlbumsQuery>,
    res: Response,
  ) => ControllerResult

  create: (
    req: Request<{}, any, CreateAlbumDto>,
    res: Response,
  ) => ControllerResult

  updateById: (
    req: Request<Pick<UpdateAlbumByIdParams, 'id'>, any, UpdateAlbumDto>,
    res: Response,
  ) => ControllerResult

  getOneById: (
    req: Request<Pick<GetOneAlbumByIdParams, 'id'>>,
    res: Response,
  ) => ControllerResult

  deleteOneById: (
    req: Request<Pick<DeleteOneAlbumByIdParams, 'id'>>,
    res: Response,
  ) => ControllerResult
}
