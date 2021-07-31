import { Document } from 'mongoose'

import { ITrack } from 'api/track/model'
import { IUser } from 'api/user/model'

export interface ITrackHistory extends Document {
  track: ITrack['_id']
  user: IUser['_id']
  listenDate: Date
}
