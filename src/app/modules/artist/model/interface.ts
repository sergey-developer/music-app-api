import { Model } from 'mongoose'

import { DocumentId } from 'database/interface/document'
import { MaybeNull } from 'shared/interface/utils'

export interface IArtistDocument {
  id: DocumentId
  name: string
  info: MaybeNull<string>
  photo: MaybeNull<string>
}

export interface IArtistModel extends Model<IArtistDocument> {}
