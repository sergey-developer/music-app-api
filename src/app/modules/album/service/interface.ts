import { DeleteResult } from 'mongodb'

import { DocumentId } from 'database/interface/document'
import { IAlbumDocument, IAlbumDocumentArray } from 'database/models/album'
import {
  CreateAlbumDto,
  GetAllAlbumsQuery,
  UpdateAlbumDto,
} from 'modules/album/dto'

export interface IGetAllAlbumsFilter extends GetAllAlbumsQuery {}

export interface ICreateOneAlbumPayload extends CreateAlbumDto {
  user: DocumentId
  image?: IAlbumDocument['image']
}

export interface IUpdateOneAlbumPayload extends UpdateAlbumDto {
  image: IAlbumDocument['image']
}

export interface IDeleteManyAlbumsFilter
  extends Partial<{
    albums: IAlbumDocumentArray
  }> {}

export interface IAlbumService {
  getAll: (filter: IGetAllAlbumsFilter) => Promise<IAlbumDocumentArray>

  getOneById: (id: IAlbumDocument['id']) => Promise<IAlbumDocument>

  createOne: (payload: ICreateOneAlbumPayload) => Promise<IAlbumDocument>

  updateOneById: (
    id: IAlbumDocument['id'],
    payload: IUpdateOneAlbumPayload,
  ) => Promise<IAlbumDocument>

  deleteOneById: (id: IAlbumDocument['id']) => Promise<IAlbumDocument>

  deleteMany: (filter: IDeleteManyAlbumsFilter) => Promise<DeleteResult>
}
