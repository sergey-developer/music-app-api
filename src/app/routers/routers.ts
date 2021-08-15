import { Application } from 'express'

import artistRouter from 'api/artist/artist.router'
import imageRouter from 'api/image/image.router'
import { APIRouter } from 'shared/interface/router'

const routers: APIRouter[] = [artistRouter, imageRouter]

const createRouters = (app: Application) => {
  routers.forEach((router) => router(app))
}

export default createRouters
