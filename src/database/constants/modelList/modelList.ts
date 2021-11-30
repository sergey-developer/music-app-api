import EntityNamesEnum from 'database/constants/entityNamesEnum'
import { IModelList } from 'database/constants/modelList'
import getModelName from 'database/utils/getModelName'
import { AlbumModel } from 'modules/../../models/model'
import { ArtistModel } from 'modules/../../models/model'
import { TrackModel } from 'modules/../../models/model'
import { TrackHistoryModel } from 'modules/../../models/model'
import { RequestModel } from 'modules/../../models/request/model'
import { SessionModel } from 'modules/../../models/session/model'
import { UserModel } from 'modules/../../models/model'

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
