import { Request, Response } from 'express'

import {
  CreateAlbumDto,
  CreateAlbumResultDto,
  GetAllQuery,
  GetOneByIdParams,
} from 'api/album/dto'
import { AlbumDocumentArray } from 'api/album/interface'
import { IAlbumDocument } from 'api/album/model'
import { ControllerResult, ResBody } from 'shared/interface/response'

export interface IAlbumController {
  getAll: (
    req: Request<{}, any, any, GetAllQuery>,
    res: Response<ResBody<AlbumDocumentArray>>,
  ) => ControllerResult

  createOne: (
    req: Request<any, any, CreateAlbumDto>,
    res: Response<ResBody<CreateAlbumResultDto>>,
  ) => ControllerResult

  getOneById: (
    req: Request<GetOneByIdParams>,
    res: Response<ResBody<IAlbumDocument>>,
  ) => ControllerResult
}
