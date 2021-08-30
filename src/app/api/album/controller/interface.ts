import { Request, Response } from 'express'

import {
  CreateAlbumDto,
  CreateAlbumResultDto,
  GetAllAlbumsFilterDto,
} from 'api/album/dto'
import { AlbumDocumentArray } from 'api/album/interface'
import { IAlbumDocument, IAlbumModel } from 'api/album/model'
import { PickDocumentId } from 'database/interface/document'
import { ReqParams, ReqQuery } from 'shared/interface/request'
import { ResBody } from 'shared/interface/response'

export interface IAlbumController {
  getAll: (
    req: Request<{}, any, any, ReqQuery<GetAllAlbumsFilterDto>>,
    res: Response<ResBody<AlbumDocumentArray>>,
  ) => Promise<void>

  createOne: (
    req: Request<any, any, CreateAlbumDto>,
    res: Response<ResBody<CreateAlbumResultDto>>,
  ) => Promise<void>

  getOneById: (
    req: Request<ReqParams<PickDocumentId<IAlbumDocument>>>,
    res: Response<ResBody<IAlbumModel>>,
  ) => Promise<void>
}
