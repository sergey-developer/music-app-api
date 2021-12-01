import { IAlbumModel } from 'database/models/album'
import { IArtistModel } from 'database/models/artist'
import { IRequestModel } from 'database/models/request'
import { ISessionModel } from 'database/models/session'
import { ITrackModel } from 'database/models/track'
import { ITrackHistoryModel } from 'database/models/trackHistory'
import { IUserModel } from 'database/models/user'
import getModelName from 'database/utils/getModelName'

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
