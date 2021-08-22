import { Request, Response } from 'express'

import { CreateAlbumDto, CreateAlbumResultDto } from 'api/album/dto'
import { ResponseBody } from 'shared/interface/response'

export interface IAlbumController {
  findAll: (req: Request, res: Response) => Promise<void>
  createOne: (
    req: Request<any, any, CreateAlbumDto>,
    res: Response<ResponseBody<CreateAlbumResultDto>>,
  ) => Promise<void>
}
