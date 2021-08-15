import { Application } from 'express'

import artistRouter from 'api/artist/artist.router'
import { APIRouter } from 'shared/interface/router'

const routers: APIRouter[] = [artistRouter]

const createRouters = (app: Application) => {
  routers.forEach((router) => router(app))
}

export default createRouters
