import { Application } from 'express'

import albumRouter from 'api/album/album.router'
import artistRouter from 'api/artist/artist.router'
import imageRouter from 'api/image/image.router'
import trackRouter from 'api/track/track.router'
import { APIRouter } from 'shared/interface/router'

const routers: APIRouter[] = [
  artistRouter,
  albumRouter,
  trackRouter,
  imageRouter,
]

const createRouters = (app: Application) => {
  routers.forEach((router) => router(app))
}

export default createRouters
