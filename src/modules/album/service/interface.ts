import { DocumentId } from 'database/interface/document'
import { CreateAlbumDto, GetAllAlbumsQuery } from 'modules/album/dto'
import { IAlbumDocumentArray } from 'modules/album/interface'
import { IAlbumDocument } from 'modules/album/model'
import { IAlbumRepository } from 'modules/album/repository'

export interface IGetAllAlbumsServiceFilter extends GetAllAlbumsQuery {}

export interface ICreateOneAlbumServicePayload extends CreateAlbumDto {
  userId: DocumentId
}

export interface IDeleteManyAlbumsServiceFilter
  extends Partial<{
    albums: IAlbumDocumentArray
  }> {}

export interface IAlbumService {
  getAll: (filter: IGetAllAlbumsServiceFilter) => Promise<IAlbumDocumentArray>

  createOne: (payload: ICreateOneAlbumServicePayload) => Promise<IAlbumDocument>

  getOneById: IAlbumRepository['findOneById']

  deleteOneById: IAlbumRepository['deleteOneById']

  deleteMany: (filter: IDeleteManyAlbumsServiceFilter) => Promise<void>
}
