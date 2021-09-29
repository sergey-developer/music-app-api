import { CreateAlbumDto, GetAllAlbumsQuery } from 'api/album/dto'
import { IAlbumDocumentArray } from 'api/album/interface'
import { IAlbumDocument } from 'api/album/model'
import { IAlbumRepository } from 'api/album/repository'
import { IUserDocument } from 'api/user/model'
import { DocumentId } from 'database/interface/document'

export interface IGetAllAlbumsServiceFilter extends GetAllAlbumsQuery {}

export interface ICreateOneAlbumServicePayload extends CreateAlbumDto {
  userId: DocumentId<IUserDocument>
}

export interface IAlbumService {
  getAll: (filter: IGetAllAlbumsServiceFilter) => Promise<IAlbumDocumentArray>

  createOne: (payload: ICreateOneAlbumServicePayload) => Promise<IAlbumDocument>

  getOneById: IAlbumRepository['findOneById']

  deleteOneById: IAlbumRepository['deleteOneById']

  deleteMany: IAlbumRepository['deleteMany']
}
