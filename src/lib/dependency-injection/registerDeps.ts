import { container as DiContainer } from 'tsyringe'

import { AlbumModel } from 'database/models/album'
import { ArtistModel } from 'database/models/artist'
import { RequestModel } from 'database/models/request'
import { SessionModel } from 'database/models/session'
import { TrackModel } from 'database/models/track'
import { TrackHistoryModel } from 'database/models/trackHistory'
import { UserModel } from 'database/models/user'
import { DiTokenEnum } from 'lib/dependency-injection'

const registerDeps = (): void => {
  DiContainer.register(DiTokenEnum.Artist, { useValue: ArtistModel })
  DiContainer.register(DiTokenEnum.Album, { useValue: AlbumModel })
  DiContainer.register(DiTokenEnum.Track, { useValue: TrackModel })
  DiContainer.register(DiTokenEnum.TrackHistory, {
    useValue: TrackHistoryModel,
  })
  DiContainer.register(DiTokenEnum.Request, { useValue: RequestModel })
  DiContainer.register(DiTokenEnum.User, { useValue: UserModel })
  DiContainer.register(DiTokenEnum.Session, { useValue: SessionModel })
}

export default registerDeps
