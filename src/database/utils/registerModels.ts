import { container as DiContainer } from 'tsyringe'

import { AlbumModel } from 'database/models/album'
import { ArtistModel } from 'database/models/artist'
import { RequestModel } from 'database/models/request'
import { SessionModel } from 'database/models/session'
import { TrackModel } from 'database/models/track'
import { TrackHistoryModel } from 'database/models/trackHistory'
import { UserModel } from 'database/models/user'
import { DiTokenEnum } from 'lib/dependency-injection'

const DiTokenToModel: Record<
  DiTokenEnum,
  | typeof ArtistModel
  | typeof AlbumModel
  | typeof TrackModel
  | typeof TrackHistoryModel
  | typeof RequestModel
  | typeof UserModel
  | typeof SessionModel
> = {
  ArtistModel: ArtistModel,
  AlbumModel: AlbumModel,
  TrackModel: TrackModel,
  TrackHistoryModel: TrackHistoryModel,
  RequestModel: RequestModel,
  UserModel: UserModel,
  SessionModel: SessionModel,
}

const registerModel = (token: DiTokenEnum) => {
  const model = DiTokenToModel[token]
  DiContainer.register(token, { useValue: model })
}

const registerModels = () => {
  Object.keys(DiTokenToModel).forEach((token) => {
    registerModel(token as DiTokenEnum)
  })
}

export { DiTokenToModel, registerModel }
export default registerModels
