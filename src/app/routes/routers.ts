import albumRouter from 'api/album/album.route'
import artistRouter from 'api/artist/artist.route'
import authRouter from 'api/auth/auth.route'
import requestRouter from 'api/request/request.route'
import trackRouter from 'api/track/track.route'
import trackHistoryRouter from 'api/trackHistory/trackHistory.route'
import uploadsRouter from 'api/uploads/uploads.route'
import { RoutersEnum } from 'app/routes/constants'
import { ApiRouter } from 'app/routes/interface'

const routers: ApiRouter[] = [
  { name: RoutersEnum.Auth, create: authRouter },
  { name: RoutersEnum.Artists, create: artistRouter },
  { name: RoutersEnum.Albums, create: albumRouter },
  { name: RoutersEnum.Tracks, create: trackRouter },
  { name: RoutersEnum.TrackHistory, create: trackHistoryRouter },
  { name: RoutersEnum.Requests, create: requestRouter },
  { name: RoutersEnum.Uploads, create: uploadsRouter },
]

export default routers
