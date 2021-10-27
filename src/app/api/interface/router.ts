import { Router } from 'express'

import { RoutersEnum } from 'api/constants'

export type CreateRouter = (router: Router) => Router

export type ApiRouter = {
  name: RoutersEnum
  creator: CreateRouter
}
