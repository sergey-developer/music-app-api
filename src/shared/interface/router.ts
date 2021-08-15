import { Application } from 'express'

export type APIRouter = (app: Application) => void
