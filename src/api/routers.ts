import { albumRouter } from 'api/album'
import { artistRouter } from 'api/artist'
import { authRouter } from 'api/auth'
import { requestRouter } from 'api/request'
import { trackRouter } from 'api/track'
import { trackHistoryRouter } from 'api/trackHistory'
import { uploadsRouter } from 'api/uploads'
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
