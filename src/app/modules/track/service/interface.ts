import { DocumentId, DocumentIdArray } from 'database/interface/document'
import {
  CreateTrackDto,
  GetAllTracksQuery,
  UpdateTrackDto,
} from 'modules/track/dto'
import { ITrackDocumentArray } from 'modules/track/interface'
import { ITrackDocument } from 'modules/track/model'
import { ITrackRepository } from 'modules/track/repository'

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

  getOneById: (id: DocumentId) => Promise<ITrackDocument>

  create: (payload: ICreateTrackPayload) => Promise<ITrackDocument>

  updateById: (id: DocumentId, payload: IUpdateTrackPayload) => Promise<void>

  deleteOneById: ITrackRepository['deleteOneById']

  deleteMany: (filter: IDeleteManyTracksFilter) => Promise<void>
}
