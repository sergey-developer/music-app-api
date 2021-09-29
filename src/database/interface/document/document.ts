import { Document, Types } from 'mongoose'

// TODO: поправить на Omit<Document<Types.ObjectId>, 'id'> и проверить
export type CustomDocument = Document<Types.ObjectId> & {}

export type PopulatedDoc<PopulatedType, RawId = Types.ObjectId> =
  | PopulatedType
  | RawId
