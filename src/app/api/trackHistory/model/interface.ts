import { Model } from 'mongoose'

import { ITrackDocument } from 'api/track/model'
import { IUserDocument } from 'api/user/model'
import { CustomDocument, PopulatedDoc } from 'database/interface/document'
import { DateType } from 'shared/interface/common'

export interface ITrackHistoryDocument extends CustomDocument {
  id: string
  track: PopulatedDoc<ITrackDocument>
  user: PopulatedDoc<IUserDocument>
  listenDate: DateType<Date>
}

export interface ITrackHistoryModel extends Model<ITrackHistoryDocument> {}
