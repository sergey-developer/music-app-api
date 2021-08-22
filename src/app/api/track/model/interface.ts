import { Document } from 'mongoose'

import { IAlbumModel } from 'api/album/model'
import { ModelId } from 'shared/interface/utils/model'

export interface ITrackModel extends Document {
  name: string
  duration: string
  published: boolean
  album: ModelId<IAlbumModel>
}
