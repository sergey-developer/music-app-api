import { Request, Response } from 'express'

import { CreateImageResultDto } from 'api/image/dto'
import { IImageDocument } from 'api/image/model'
import { PickDocumentId } from 'database/interface/document'
import { ReqParams } from 'shared/interface/request'
import { ResBody } from 'shared/interface/response'

export interface IImageController {
  createOne: (
    req: Request,
    res: Response<ResBody<CreateImageResultDto>>,
  ) => Promise<void>

  deleteOneById: (
    req: Request<ReqParams<PickDocumentId<IImageDocument>>>,
    res: Response,
  ) => Promise<void>
}
