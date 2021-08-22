import { Request, Response } from 'express'

import { CreateArtistDto, CreateArtistResultDto } from 'api/artist/dto'
import { ResBody } from 'shared/interface/response'

export interface IArtistController {
  getAll: (req: Request, res: Response) => Promise<void>

  createOne: (
    req: Request<any, any, CreateArtistDto>,
    res: Response<ResBody<CreateArtistResultDto>>,
  ) => Promise<void>
}
