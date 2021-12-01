import { EntityNamesEnum } from 'database/constants'
import { AlbumModel } from 'database/models/album'
import { ArtistModel } from 'database/models/artist'
import { RequestModel } from 'database/models/request'
import { SessionModel } from 'database/models/session'
import { TrackModel } from 'database/models/track'
import { TrackHistoryModel } from 'database/models/trackHistory'
import { UserModel } from 'database/models/user'
import getModelName from 'database/utils/getModelName'
import { IModelList } from 'database/utils/modelList'

const modelList: IModelList = [
  {
    name: getModelName(EntityNamesEnum.Artist),
    value: ArtistModel,
  },
  {
    name: getModelName(EntityNamesEnum.Album),
    value: AlbumModel,
  },
  {
    name: getModelName(EntityNamesEnum.Track),
    value: TrackModel,
  },
  {
    name: getModelName(EntityNamesEnum.TrackHistory),
    value: TrackHistoryModel,
  },
  {
    name: getModelName(EntityNamesEnum.Request),
    value: RequestModel,
  },
  {
    name: getModelName(EntityNamesEnum.User),
    value: UserModel,
  },
  {
    name: getModelName(EntityNamesEnum.Session),
    value: SessionModel,
  },
]

export default modelList
