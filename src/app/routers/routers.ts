import { Application } from 'express'

import albumRouter from 'api/album/album.router'
import artistRouter from 'api/artist/artist.router'
import imageRouter from 'api/image/image.router'
import trackRouter from 'api/track/track.router'
import userRouter from 'api/user/user.router'
import { APIRouter } from 'shared/interface/router'

const routers: APIRouter[] = [
  userRouter,
  artistRouter,
  albumRouter,
  trackRouter,
  imageRouter,
]

const createRouters = (app: Application) => {
  routers.forEach((router) => router(app))
}

export default createRouters
