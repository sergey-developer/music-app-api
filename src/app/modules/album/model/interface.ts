import { Model } from 'mongoose'

import { DocumentId, PopulatedDoc } from 'database/interface/document'
import { IArtistDocument } from 'modules/artist/model'
import { MaybeNull } from 'shared/interface/utils'

export interface IAlbumDocument {
  id: DocumentId
  name: string
  releaseDate: string
  artist: PopulatedDoc<IArtistDocument>
  image: MaybeNull<string>
}

export interface IAlbumModel extends Model<IAlbumDocument> {}
