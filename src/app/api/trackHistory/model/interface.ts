import { Document } from 'mongoose'

import { ITrackModel } from 'api/track/model'
import { IUserModel } from 'api/user/model'
import { ModelId } from 'shared/interface/utils/model'

export interface ITrackHistoryModel extends Document {
  track: ModelId<ITrackModel>
  user: ModelId<IUserModel>
  listenDate: Date
}
