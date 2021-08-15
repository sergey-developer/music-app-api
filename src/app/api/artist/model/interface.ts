import { Document } from 'mongoose'

import { IImageModel } from 'api/image/model'
import { MaybeNull } from 'shared/interface/common'

export interface IArtistModel extends Document {
  name: string
  info: MaybeNull<string>
  published: boolean
  photo: MaybeNull<IImageModel['_id']>
}

export type ArtistModelArray = IArtistModel[]
