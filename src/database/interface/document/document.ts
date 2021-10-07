export type DocumentId = string

export type OnlyDocumentId = {
  id: DocumentId
}

export type DocumentIdArray = Array<DocumentId>

export type PopulatedDoc<PopulatedType, RawId = string> = PopulatedType | RawId
