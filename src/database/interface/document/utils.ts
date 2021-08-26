type BaseDocumentShape = { id: string }

export type DocumentId<T extends BaseDocumentShape> = T['id']

export type PickDocumentId<T extends BaseDocumentShape> = {
  id: DocumentId<T>
}
