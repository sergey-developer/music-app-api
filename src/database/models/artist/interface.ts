import { Model } from 'mongoose'

import { MaybeNull } from 'app/interface/utils'
import { DocumentId } from 'database/interface/document'

export interface IArtistDocument {
  id: DocumentId
  name: string
  info: MaybeNull<string>
  photo: MaybeNull<string>
}

export interface IArtistModel extends Model<IArtistDocument> {}
