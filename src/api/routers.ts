import albumRouter from 'api/album.router'
import artistRouter from 'api/artist.router'
import authRouter from 'api/auth.router'
import requestRouter from 'api/request.router'
import trackRouter from 'api/track.router'
import trackHistoryRouter from 'api/trackHistory.router'
import uploadsRouter from 'api/uploads.router'
import { RoutersEnum } from 'shared/constants/routers'
import { ApiRouter } from 'shared/interface/router'

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
