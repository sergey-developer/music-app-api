import { Model } from 'mongoose'

import { PopulatedDoc } from 'database/interface/document'
import { IArtistDocument } from 'modules/artist/model'
import { IImageDocument } from 'modules/image/model'
import { MaybeNull } from 'shared/interface/utils'

export interface IAlbumDocument {
  id: string
  name: string
  releaseDate: string
  image: MaybeNull<PopulatedDoc<IImageDocument>>
  artist: PopulatedDoc<IArtistDocument>
}

export interface IAlbumModel extends Model<IAlbumDocument> {}
