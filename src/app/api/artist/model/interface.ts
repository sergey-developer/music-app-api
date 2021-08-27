import { Model } from 'mongoose'

import { IImageDocument } from 'api/image/model'
import { CustomDocument, PopulatedDoc } from 'database/interface/document'
import { MaybeNull } from 'shared/interface/utils/common'

export interface IArtistDocument extends CustomDocument {
  id: string
  name: string
  info: MaybeNull<string>
  published: boolean
  photo: MaybeNull<PopulatedDoc<IImageDocument>>
}

export interface IArtistModel extends Model<IArtistDocument> {}
