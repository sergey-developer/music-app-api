import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { IMulterFile } from 'lib/multer'
import { IImageDocument } from 'modules/image/model'

export interface ICreateImagePayload extends IMulterFile {}

export interface IDeleteManyImagesFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface IImageRepository {
  createOne: (payload: ICreateImagePayload) => Promise<IImageDocument>

  deleteOneById: (id: DocumentId) => Promise<IImageDocument>

  deleteMany: (filter: IDeleteManyImagesFilter) => Promise<void>
}
