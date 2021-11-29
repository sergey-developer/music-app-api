import { ObjectId } from 'mongoose'

export type DocumentId = string

export type OnlyDocumentId = {
  id: DocumentId
}

export type DocumentIdArray = Array<DocumentId>

export type PopulatedDoc<PopulatedType, RawId = ObjectId> =
  | PopulatedType
  | RawId
