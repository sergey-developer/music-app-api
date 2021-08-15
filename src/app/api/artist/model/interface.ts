import { Document } from 'mongoose'

import { Nullable } from 'shared/interface/common'

export interface IArtistModel extends Document {
  name: string
  photo: Nullable<string>
  info: Nullable<string>
  published: boolean
}

export type ArtistModelArray = IArtistModel[]
