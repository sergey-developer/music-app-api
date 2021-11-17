import { Model } from 'mongoose'

import { DocumentId, PopulatedDoc } from 'database/interface/document'
import { ITrackDocument } from 'modules/track/model'
import { IUserDocument } from 'modules/user/model'
import { MaybeNull } from 'shared/interface/utils'

export interface ITrackHistoryDocument {
  id: DocumentId
  track: PopulatedDoc<MaybeNull<ITrackDocument>>
  user: PopulatedDoc<IUserDocument>
  listenDate: string
}

export interface ITrackHistoryModel extends Model<ITrackHistoryDocument> {}
