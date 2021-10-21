import { DocumentIdArray } from 'database/interface/document'
import { IImageDocument } from 'modules/image/model'

export interface ICreateImagePayload extends Omit<IImageDocument, 'id'> {}

export interface IUpdateImagePayload
  extends Partial<Omit<IImageDocument, 'id'>> {}

export interface IUpdateImageFilter
  extends Partial<{
    id: IImageDocument['id']
  }> {}

export interface IDeleteOneImageFilter
  extends Partial<{
    id: IImageDocument['id']
    fileName: IImageDocument['fileName']
  }> {}

export interface IDeleteManyImagesFilter
  extends Partial<{
    ids: DocumentIdArray
    fileNames: Array<IImageDocument['fileName']>
  }> {}

export interface IImageRepository {
  findOneById: (id: IImageDocument['id']) => Promise<IImageDocument>

  createOne: (payload: ICreateImagePayload) => Promise<IImageDocument>

  updateOne: (
    filter: IUpdateImageFilter,
    payload: IUpdateImagePayload,
  ) => Promise<IImageDocument>

  deleteOne: (filter: IDeleteOneImageFilter) => Promise<IImageDocument>

  deleteMany: (filter: IDeleteManyImagesFilter) => Promise<void>
}
