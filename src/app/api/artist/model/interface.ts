import { Document, Model, Types } from 'mongoose'

import { IImageDocument } from 'api/image/model'
import { PopulatedDoc } from 'database/interface/document'
import { MaybeNull } from 'shared/interface/utils/common'

export interface IArtistDocument extends Document<Types.ObjectId> {
  id: string
  name: string
  info: MaybeNull<string>
  published: boolean
  photo: MaybeNull<PopulatedDoc<IImageDocument>>
}

export interface IArtistModel extends Model<IArtistDocument> {}
