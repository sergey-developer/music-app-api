import { Document } from 'mongoose'

import { IImageModel } from 'api/image/model'
import { MaybeNull } from 'shared/interface/utils/common'
import { ModelId } from 'shared/interface/utils/model'

export interface IArtistModel extends Document {
  name: string
  info: MaybeNull<string>
  published: boolean
  photo: MaybeNull<ModelId<IImageModel>>
}

export type ArtistModelArray = IArtistModel[]
