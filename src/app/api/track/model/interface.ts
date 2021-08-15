import { Document } from 'mongoose'

import { IAlbumModel } from 'api/album/model'

export interface ITrackModel extends Document {
  name: string
  duration: string
  published: boolean
  album: IAlbumModel['_id']
}
