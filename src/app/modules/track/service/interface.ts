import { DeleteResult } from 'mongodb'

import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { ITrackDocument, ITrackDocumentArray } from 'database/models/track'
import {
  CreateTrackDto,
  GetAllTracksQuery,
  UpdateTrackDto,
} from 'modules/track/dto'

export interface IGetAllTracksFilter
  extends Omit<GetAllTracksQuery, 'album'>,
    Partial<{
      albumId: DocumentId
      albumIds: DocumentIdArray
    }> {}

export interface IUpdateOneTrackPayload extends UpdateTrackDto {}

export interface IDeleteManyTracksFilter
  extends Partial<{
    tracks: ITrackDocumentArray
  }> {}

export interface ICreateOneTrackPayload extends CreateTrackDto {
  user: DocumentId
}

export interface ITrackService {
  getAll: (filter: IGetAllTracksFilter) => Promise<ITrackDocumentArray>

  getOneById: (id: ITrackDocument['id']) => Promise<ITrackDocument>

  createOne: (payload: ICreateOneTrackPayload) => Promise<ITrackDocument>

  updateOneById: (
    id: ITrackDocument['id'],
    payload: IUpdateOneTrackPayload,
  ) => Promise<ITrackDocument>

  deleteOneById: (id: ITrackDocument['id']) => Promise<ITrackDocument>

  deleteMany: (filter: IDeleteManyTracksFilter) => Promise<DeleteResult>
}
