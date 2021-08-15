import { Request, Response } from 'express'

import { CreateArtistDto, CreateArtistResultDto } from 'api/artist/dto'
import { ResponseBody } from 'shared/interface/response'

export interface IArtistController {
  findAll: (req: Request, res: Response) => Promise<void>
  createOne: (
    req: Request<any, any, CreateArtistDto>,
    res: Response<ResponseBody<CreateArtistResultDto>>,
  ) => Promise<void>
}
