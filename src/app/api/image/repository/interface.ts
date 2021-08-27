import { IImageDocument } from 'api/image/model'
import { IMulterFile } from 'api/uploads/middlewares/upload'
import { DocumentId } from 'database/interface/document'

export interface IImageRepository {
  createOne: (payload: IMulterFile) => Promise<IImageDocument>
  deleteOneById: (id: DocumentId<IImageDocument>) => Promise<void>
}
