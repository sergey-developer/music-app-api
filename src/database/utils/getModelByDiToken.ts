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

const getModelByDiToken = (token: DiTokenEnum) => {
  return DiTokenToModel[token]
}

export { DiTokenToModel }

export default getModelByDiToken
