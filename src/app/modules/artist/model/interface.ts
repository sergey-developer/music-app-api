import { Model } from 'mongoose'

import { PopulatedDoc } from 'database/interface/document'
import { IImageDocument } from 'modules/image/model'
import { MaybeNull } from 'shared/interface/utils'

export interface IArtistDocument {
  id: string
  name: string
  info: MaybeNull<string>
  photo: MaybeNull<PopulatedDoc<IImageDocument>>
}

export interface IArtistModel extends Model<IArtistDocument> {}
