import { CreateAlbumDto } from 'api/album/dto'
import { IAlbumDocument } from 'api/album/model'
import { IAlbumRepository } from 'api/album/repository'
import { IUserDocument } from 'api/user/model'
import { DocumentId } from 'database/interface/document'

export interface ICreateAlbumServicePayload extends CreateAlbumDto {
  userId: DocumentId<IUserDocument>
}

export interface IAlbumService {
  getAll: IAlbumRepository['findAllWhere']
  createOne: (payload: ICreateAlbumServicePayload) => Promise<IAlbumDocument>
  getOneById: IAlbumRepository['findOneById']
}
