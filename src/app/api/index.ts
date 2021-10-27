import albumRouter from 'api/album.router'
import artistRouter from 'api/artist.router'
import authRouter from 'api/auth.router'
import { RoutersEnum } from 'api/constants'
import { ApiRouter } from 'api/interface'
import requestRouter from 'api/request.router'
import trackRouter from 'api/track.router'
import trackHistoryRouter from 'api/trackHistory.router'

const routers: ApiRouter[] = [
  { name: RoutersEnum.Auth, creator: authRouter },
  { name: RoutersEnum.Artists, creator: artistRouter },
  { name: RoutersEnum.Albums, creator: albumRouter },
  { name: RoutersEnum.Tracks, creator: trackRouter },
  { name: RoutersEnum.TrackHistory, creator: trackHistoryRouter },
  { name: RoutersEnum.Requests, creator: requestRouter },
]

export default routers
