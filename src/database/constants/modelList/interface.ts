import getModelName from 'database/utils/getModelName'
import { IAlbumModel } from 'modules/album/model'
import { IArtistModel } from 'modules/artist/model'
import { IRequestModel } from 'modules/request/model'
import { ISessionModel } from 'modules/session/model'
import { ITrackModel } from 'modules/track/model'
import { ITrackHistoryModel } from 'modules/trackHistory/model'
import { IUserModel } from 'modules/user/model'

export interface IModelListItem {
  name: ReturnType<typeof getModelName>
  value:
    | IArtistModel
    | IAlbumModel
    | ITrackModel
    | ITrackHistoryModel
    | IUserModel
    | ISessionModel
    | IRequestModel
}

export interface IModelList extends Array<IModelListItem> {}
