import { Request, Response } from 'express'

import {
  CreateAlbumDto,
  DeleteOneAlbumByIdParams,
  GetAllAlbumsQuery,
  GetOneAlbumByIdParams,
} from 'api/album/dto'
import { ControllerResult } from 'shared/interface/response'

export interface IAlbumController {
  getAll: (
    req: Request<{}, any, any, GetAllAlbumsQuery>,
    res: Response,
  ) => ControllerResult

  createOne: (
    req: Request<{}, any, CreateAlbumDto>,
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
