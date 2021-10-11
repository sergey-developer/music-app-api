import { Router } from 'express'

export type CreateRouter = (router: Router) => Router

export type ApiRouter = {
  name: string
  create: CreateRouter
}
