import { Document, Model, Types } from 'mongoose'

import { IArtistDocument } from 'api/artist/model'
import { IImageDocument } from 'api/image/model'
import { PopulatedDoc } from 'database/interface/document'
import { MaybeNull } from 'shared/interface/utils/common'

export interface IAlbumDocument extends Document<Types.ObjectId> {
  id: string
  name: string
  published: boolean
  releaseDate: string
  image: MaybeNull<PopulatedDoc<IImageDocument>>
  artist: PopulatedDoc<IArtistDocument>
}

export interface IAlbumModel extends Model<IAlbumDocument> {}
