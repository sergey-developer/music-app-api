import { Document, Types } from 'mongoose'

export type CustomDocument = Document<Types.ObjectId> & {
  id: string
}

export type PopulatedDoc<PopulatedType, RawId = Types.ObjectId> =
  | PopulatedType
  | RawId
