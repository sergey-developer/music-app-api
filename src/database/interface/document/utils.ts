import { Document } from 'mongoose'

export type DocumentId<T extends Document> = T['id']

export type PickDocumentId<T extends Document> = {
  id: DocumentId<T>
}
