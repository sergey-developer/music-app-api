import { Request, Response } from 'express'

export interface IImageController {
  createOne: (req: Request, res: Response) => Promise<void>
}
