import { Document } from 'mongoose'

import { ITrackModel } from 'api/track/model'
import { IUserModel } from 'api/user/model'

export interface ITrackHistoryModel extends Document {
  track: ITrackModel['_id']
  user: IUserModel['_id']
  listenDate: Date
}
