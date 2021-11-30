import getModelName from 'database/utils/getModelName'
import { IAlbumModel } from 'modules/../../models/model'
import { IArtistModel } from 'modules/../../models/model'
import { ITrackModel } from 'modules/../../models/model'
import { ITrackHistoryModel } from 'modules/../../models/model'
import { IRequestModel } from 'modules/../../models/request/model'
import { ISessionModel } from 'modules/../../models/session/model'
import { IUserModel } from 'modules/../../models/model'

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
