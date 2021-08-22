import { Document } from 'mongoose'

import { IImageModel } from 'api/image/model'
import { MaybeNull } from 'shared/interface/utils/common'
import { OnlyModelId } from 'shared/interface/utils/model'

export interface IArtistModel extends Document {
  name: string
  info: MaybeNull<string>
  published: boolean
  photo: MaybeNull<OnlyModelId<IImageModel>>
}

export type ArtistModelArray = IArtistModel[]
