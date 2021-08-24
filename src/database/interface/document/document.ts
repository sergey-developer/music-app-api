import { Types } from 'mongoose'

export type PopulatedDoc<PopulatedType, RawId = Types.ObjectId> =
  | PopulatedType
  | RawId
