import config from 'config'
import { container as DiContainer } from 'tsyringe'

import { AlbumModel } from 'database/models/album'
import { ArtistModel } from 'database/models/artist'
import { RequestModel } from 'database/models/request'
import { SessionModel } from 'database/models/session'
import { TrackModel } from 'database/models/track'
import { TrackHistoryModel } from 'database/models/trackHistory'
import { UserModel } from 'database/models/user'
import { DiTokenEnum } from 'lib/dependency-injection'
import logger from 'lib/logger'

const registerDependencies = (): void => {
  // Models
  DiContainer.register(DiTokenEnum.Artist, { useValue: ArtistModel })
  DiContainer.register(DiTokenEnum.Album, { useValue: AlbumModel })
  DiContainer.register(DiTokenEnum.Track, { useValue: TrackModel })
  DiContainer.register(DiTokenEnum.TrackHistory, {
    useValue: TrackHistoryModel,
  })
  DiContainer.register(DiTokenEnum.Request, { useValue: RequestModel })
  DiContainer.register(DiTokenEnum.User, { useValue: UserModel })
  DiContainer.register(DiTokenEnum.Session, { useValue: SessionModel })

  DiContainer.register(DiTokenEnum.Config, { useValue: config })
  DiContainer.register(DiTokenEnum.Logger, { useValue: logger })
}

export default registerDependencies
