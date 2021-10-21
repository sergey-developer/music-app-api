import { Model } from 'mongoose'

import { DocumentId, PopulatedDoc } from 'database/interface/document'
import { IImageDocument } from 'modules/image/model'
import { MaybeNull } from 'shared/interface/utils'

export interface IArtistDocument {
  id: DocumentId
  name: string
  info: MaybeNull<string>
  photo: MaybeNull<PopulatedDoc<IImageDocument>>
}

export interface IArtistModel extends Model<IArtistDocument> {}
