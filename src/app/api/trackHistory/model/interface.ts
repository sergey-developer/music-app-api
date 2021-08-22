import { Document } from 'mongoose'

import { ITrackModel } from 'api/track/model'
import { IUserModel } from 'api/user/model'
import { OnlyModelId } from 'shared/interface/utils/model'

export interface ITrackHistoryModel extends Document {
  track: OnlyModelId<ITrackModel>
  user: OnlyModelId<IUserModel>
  listenDate: Date
}
