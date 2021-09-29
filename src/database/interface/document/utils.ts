import { Document } from 'mongoose'

// TODO: поправить на extends CustomDocument
export type DocumentId<T extends Document> = T['id']

// TODO: поправить на extends CustomDocument
export type PickDocumentId<T extends Document> = {
  id?: DocumentId<T>
}
