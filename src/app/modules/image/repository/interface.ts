import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { IImageDocument } from 'modules/image/model'

export interface ICreateImagePayload extends Omit<IImageDocument, 'id'> {}

export interface IDeleteManyImagesFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface IImageRepository {
  findOneById: (id: DocumentId) => Promise<IImageDocument>

  createOne: (payload: ICreateImagePayload) => Promise<IImageDocument>

  deleteOne: (id: DocumentId, filename: string) => Promise<IImageDocument>

  deleteMany: (filter: IDeleteManyImagesFilter) => Promise<void>
}
