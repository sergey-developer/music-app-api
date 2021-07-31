import { Document } from 'mongoose'

import { IArtist } from 'api/artist/model'
import { Nullable } from 'shared/types/common'

export interface IAlbum extends Document {
  name: string
  artist: IArtist['_id']
  releaseDate: Date
  published: boolean
  image: Nullable<string>
}
