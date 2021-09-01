import { Request, Response } from 'express'

import {
  CreateAlbumDto,
  CreateAlbumResultDto,
  GetAllAlbumsQuery,
} from 'api/album/dto'
import { AlbumDocumentArray } from 'api/album/interface'
import { IAlbumDocument } from 'api/album/model'
import { ControllerResult, ResBody } from 'shared/interface/response'
import { IdParam } from 'shared/utils/validation'

export interface IAlbumController {
  getAll: (
    req: Request<{}, any, any, GetAllAlbumsQuery>,
    res: Response<ResBody<AlbumDocumentArray>>,
  ) => ControllerResult

  createOne: (
    req: Request<{}, any, CreateAlbumDto>,
    res: Response<ResBody<CreateAlbumResultDto>>,
  ) => ControllerResult

  getOneById: (
    req: Request<Pick<IdParam, 'id'>>,
    res: Response<ResBody<IAlbumDocument>>,
  ) => ControllerResult
}
