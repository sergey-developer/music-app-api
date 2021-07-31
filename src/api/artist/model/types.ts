import { Document } from 'mongoose'

import { Nullable } from 'shared/types/common'

export interface IArtist extends Document {
  name: string
  photo: Nullable<string>
  info: Nullable<string>
  published: boolean
}
