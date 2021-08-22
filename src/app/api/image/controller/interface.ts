import { Request, Response } from 'express'

import { CreateImageResultDto } from 'api/image/dto'
import { ResBody } from 'shared/interface/response'

export interface IImageController {
  createOne: (
    req: Request,
    res: Response<ResBody<CreateImageResultDto>>,
  ) => Promise<void>

  deleteOneById: (req: Request<{ id: string }>, res: Response) => Promise<void>
}
