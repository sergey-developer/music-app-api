import { DocumentIdArray } from 'database/interface/document'
import { IImageDocument } from 'modules/image/model'

export interface ICreateImagePayload extends Omit<IImageDocument, 'id'> {}

export interface IDeleteOneImageFilter {
  fileName: IImageDocument['fileName']
}

export interface IDeleteManyImagesFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface IImageRepository {
  findOneById: (id: IImageDocument['id']) => Promise<IImageDocument>

  createOne: (payload: ICreateImagePayload) => Promise<IImageDocument>

  deleteOne: (filter: IDeleteOneImageFilter) => Promise<IImageDocument>

  deleteMany: (filter: IDeleteManyImagesFilter) => Promise<void>
}
