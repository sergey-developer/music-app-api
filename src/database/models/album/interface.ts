import { Model, PopulatedDoc } from 'mongoose'

import { MaybeNull } from 'app/interface/utils'
import { DocumentId } from 'database/interface/document'
import { IArtistDocument } from 'database/models/artist'

export interface IAlbumDocument {
  id: DocumentId
  name: string
  releaseDate: string
  artist: PopulatedDoc<IArtistDocument>
  image: MaybeNull<string>
}

export interface IAlbumModel extends Model<IAlbumDocument> {}
