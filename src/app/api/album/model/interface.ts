import { Document } from 'mongoose'

import { IArtistModel } from 'api/artist/model'
import { Nullable } from 'shared/interface/common'

export interface IAlbumModel extends Document {
  name: string
  artist: IArtistModel['_id']
  releaseDate: Date
  published: boolean
  image: Nullable<string>
}
