import { Request, Response } from 'express'

import { CreateAlbumDto, CreateAlbumResultDto } from 'api/album/dto'
import { AlbumModelArray, GetAllAlbumsFilterDto } from 'api/album/interface'
import { IAlbumModel } from 'api/album/model'
import { ReqParams, ReqQuery } from 'shared/interface/request'
import { ResBody } from 'shared/interface/response'
import { PickModelId } from 'shared/interface/utils/model'

export interface IAlbumController {
  getAll: (
    req: Request<{}, any, any, ReqQuery<GetAllAlbumsFilterDto>>,
    res: Response<ResBody<AlbumModelArray>>,
  ) => Promise<void>

  createOne: (
    req: Request<any, any, CreateAlbumDto>,
    res: Response<ResBody<CreateAlbumResultDto>>,
  ) => Promise<void>

  getOneById: (
    req: Request<ReqParams<PickModelId<IAlbumModel>>>,
    res: Response<ResBody<IAlbumModel>>,
  ) => Promise<void>
}
