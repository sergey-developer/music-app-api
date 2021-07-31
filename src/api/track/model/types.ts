import { Document } from 'mongoose'

import { IAlbum } from 'api/album/model'

export interface ITrack extends Document {
  name: string
  duration: string
  published: boolean
  album: IAlbum['_id']
}
