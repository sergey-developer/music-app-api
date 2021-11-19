import { DocumentId, DocumentIdArray } from 'database/interface/document'
import {
  CreateTrackDto,
  GetAllTracksQuery,
  UpdateTrackDto,
} from 'modules/track/dto'
import { ITrackDocumentArray } from 'modules/track/interface'
import { ITrackDocument } from 'modules/track/model'

export interface IGetAllTracksFilter
  extends Omit<GetAllTracksQuery, 'album'>,
    Partial<{
      albumIds: DocumentIdArray
    }> {}

export interface IUpdateTrackPayload extends UpdateTrackDto {}

export interface IDeleteManyTracksFilter
  extends Partial<{
    tracks: ITrackDocumentArray
  }> {}

export interface ICreateTrackPayload extends CreateTrackDto {
  userId: DocumentId
}

export interface ITrackService {
  getAll: (filter: IGetAllTracksFilter) => Promise<ITrackDocumentArray>

  getOneById: (id: ITrackDocument['id']) => Promise<ITrackDocument>

  createOne: (payload: ICreateTrackPayload) => Promise<ITrackDocument>

  updateOneById: (
    id: ITrackDocument['id'],
    payload: IUpdateTrackPayload,
  ) => Promise<ITrackDocument>

  deleteOneById: (id: ITrackDocument['id']) => Promise<ITrackDocument>

  deleteMany: (filter: IDeleteManyTracksFilter) => Promise<void>
}
