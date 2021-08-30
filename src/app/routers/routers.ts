import { Application } from 'express'

import albumRouter from 'api/album/album.router'
import artistRouter from 'api/artist/artist.router'
import authRouter from 'api/auth/auth.router'
import requestRouter from 'api/request/request.router'
import trackRouter from 'api/track/track.router'
import uploadsRouter from 'api/uploads/uploads.router'
import { APIRouter } from 'app/routers/interface'

const routers: APIRouter[] = [
  authRouter,
  artistRouter,
  albumRouter,
  trackRouter,
  requestRouter,
  uploadsRouter,
]

const createRouters = (app: Application) => {
  routers.forEach((router) => router(app))
}

export default createRouters
