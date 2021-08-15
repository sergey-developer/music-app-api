import { Document } from 'mongoose'

import { IArtistModel } from 'api/artist/model'
import { IImageModel } from 'api/image/model'
import { MaybeNull } from 'shared/interface/common'

export interface IAlbumModel extends Document {
  name: string
  published: boolean
  releaseDate: Date
  image: MaybeNull<IImageModel['_id']>
  artist: IArtistModel['_id']
}
