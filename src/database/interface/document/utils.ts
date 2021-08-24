export type DocumentId<T extends { id: string }> = T['id']

export type PickDocumentId<T extends { id: string }> = {
  id: DocumentId<T>
}
