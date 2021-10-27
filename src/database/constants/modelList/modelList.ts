import { EntityNamesEnum } from 'database/constants/entityNames'
import { IModelList } from 'database/constants/modelList'
import getModelName from 'database/utils/getModelName'
import { AlbumModel } from 'modules/album/model'
import { ArtistModel } from 'modules/artist/model'
import { RequestModel } from 'modules/request/model'
import { SessionModel } from 'modules/session/model'
import { TrackModel } from 'modules/track/model'
import { TrackHistoryModel } from 'modules/trackHistory/model'
import { UserModel } from 'modules/user/model'

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
