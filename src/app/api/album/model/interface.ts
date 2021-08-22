import { Document } from 'mongoose'

import { IArtistModel } from 'api/artist/model'
import { IImageModel } from 'api/image/model'
import { MaybeNull } from 'shared/interface/utils/common'
import { OnlyModelId } from 'shared/interface/utils/model'

export interface IAlbumModel extends Document {
  name: string
  published: boolean
  releaseDate: Date
  image: MaybeNull<OnlyModelId<IImageModel>>
  artist: OnlyModelId<IArtistModel>
}

export type AlbumModelArray = IAlbumModel[]
