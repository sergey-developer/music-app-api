import { Application } from 'express'

import albumRoute from 'api/album/album.router'
import artistRoute from 'api/artist/artist.router'
import authRoute from 'api/auth/auth.router'
import requestRoute from 'api/request/request.router'
import trackRoute from 'api/track/track.router'
import trackHistoryRoute from 'api/trackHistory/trackHistory.router'
import uploadsRoute from 'api/uploads/uploads.router'
import { APIRouter } from 'app/routers/interface'

const routers: APIRouter[] = [
  authRoute,
  artistRoute,
  albumRoute,
  trackRoute,
  trackHistoryRoute,
  requestRoute,
  uploadsRoute,
]

const createRouters = (app: Application) => {
  routers.forEach((router) => router(app))
}

export default createRouters
