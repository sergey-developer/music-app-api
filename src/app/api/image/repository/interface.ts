import { CreateImageDto } from 'api/image/dto'
import { IImageDocument } from 'api/image/model'
import { DocumentId } from 'database/interface/document'

export interface IImageRepository {
  createOne: (payload: CreateImageDto) => Promise<IImageDocument>
  deleteOneById: (id: DocumentId<IImageDocument>) => Promise<void>
}
