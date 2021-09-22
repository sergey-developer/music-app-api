import { Application } from 'express'

export type APIRoute = (app: Application) => void
