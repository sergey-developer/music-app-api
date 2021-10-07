import { IImageDocument } from 'api/image/model'
import { IMulterFile } from 'api/uploads/middlewares/upload'
import { DocumentId, DocumentIdArray } from 'database/interface/document'

export interface IDeleteManyImagesRepositoryFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface IImageRepository {
  createOne: (payload: IMulterFile) => Promise<IImageDocument>

  deleteOneById: (id: DocumentId) => Promise<IImageDocument>

  deleteMany: (filter: IDeleteManyImagesRepositoryFilter) => Promise<void>
}
