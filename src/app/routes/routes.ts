import { Application } from 'express'

import albumRoute from 'api/album/album.route'
import artistRoute from 'api/artist/artist.route'
import authRoute from 'api/auth/auth.route'
import requestRoute from 'api/request/request.route'
import trackRoute from 'api/track/track.route'
import trackHistoryRoute from 'api/trackHistory/trackHistory.route'
import uploadsRoute from 'api/uploads/uploads.route'
import { APIRoute } from 'app/routes/interface'

const routes: APIRoute[] = [
  authRoute,
  artistRoute,
  albumRoute,
  trackRoute,
  trackHistoryRoute,
  requestRoute,
  uploadsRoute,
]

const createRoutes = (app: Application) => {
  routes.forEach((route) => route(app))
}

export default createRoutes
