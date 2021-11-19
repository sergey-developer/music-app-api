import { DocumentId } from 'database/interface/document'
import {
  CreateAlbumDto,
  GetAllAlbumsQuery,
  UpdateAlbumDto,
} from 'modules/album/dto'
import { IAlbumDocumentArray } from 'modules/album/interface'
import { IAlbumDocument } from 'modules/album/model'
import { IAlbumRepository } from 'modules/album/repository'

export interface IGetAllAlbumsFilter extends GetAllAlbumsQuery {}

export interface ICreateAlbumPayload extends CreateAlbumDto {
  userId: DocumentId
  image?: IAlbumDocument['image']
}

export interface IUpdateAlbumPayload extends UpdateAlbumDto {
  image: IAlbumDocument['image']
}

export interface IDeleteManyAlbumsFilter
  extends Partial<{
    albums: IAlbumDocumentArray
  }> {}

export interface IAlbumService {
  getAll: (filter: IGetAllAlbumsFilter) => Promise<IAlbumDocumentArray>

  getOneById: IAlbumRepository['findOneById']

  createOne: (payload: ICreateAlbumPayload) => Promise<IAlbumDocument>

  updateOneById: (
    id: IAlbumDocument['id'],
    payload: IUpdateAlbumPayload,
  ) => Promise<IAlbumDocument>

  deleteOneById: IAlbumRepository['deleteOneById']

  deleteMany: (filter: IDeleteManyAlbumsFilter) => Promise<void>
}
