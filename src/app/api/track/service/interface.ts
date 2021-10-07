import { CreateTrackDto, GetAllTracksQuery } from 'api/track/dto'
import { ITrackDocumentArray } from 'api/track/interface'
import { ITrackDocument } from 'api/track/model'
import { ITrackRepository } from 'api/track/repository'
import { DocumentId, DocumentIdArray } from 'database/interface/document'

export interface IGetAllTracksServiceFilter
  extends GetAllTracksQuery,
    Partial<{
      albumIds: DocumentIdArray
    }> {}

export interface IDeleteManyTracksServiceFilter
  extends Partial<{
    tracks: ITrackDocumentArray
  }> {}

export interface ICreateTrackServicePayload extends CreateTrackDto {
  userId: DocumentId
}

export interface ITrackService {
  getAll: (filter: IGetAllTracksServiceFilter) => Promise<ITrackDocumentArray>

  createOne: (payload: ICreateTrackServicePayload) => Promise<ITrackDocument>

  deleteOneById: ITrackRepository['deleteOneById']

  deleteMany: (filter: IDeleteManyTracksServiceFilter) => Promise<void>
}
