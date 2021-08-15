import { Request, Response } from 'express'

import { CreateArtistDto } from 'api/artist/dto'
import { Request as CustomRequest } from 'shared/interface/request'

export interface IArtistController {
  findAll: (req: Request, res: Response) => Promise<void>
  createOne: (
    req: CustomRequest<CreateArtistDto>,
    res: Response,
  ) => Promise<void>
}
