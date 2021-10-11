import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { IMulterFile } from 'lib/multer'
import { IImageDocument } from 'modules/image/model'

export interface IDeleteManyImagesRepositoryFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface IImageRepository {
  createOne: (payload: IMulterFile) => Promise<IImageDocument>

  deleteOneById: (id: DocumentId) => Promise<IImageDocument>

  deleteMany: (filter: IDeleteManyImagesRepositoryFilter) => Promise<void>
}
