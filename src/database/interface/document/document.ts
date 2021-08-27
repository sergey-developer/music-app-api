import { Document, Types } from 'mongoose'

export type CustomDocument = Document<Types.ObjectId> & {}

export type PopulatedDoc<PopulatedType, RawId = Types.ObjectId> =
  | PopulatedType
  | RawId
