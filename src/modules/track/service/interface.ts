import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { CreateTrackDto, GetAllTracksQuery } from 'modules/track/dto'
import { ITrackDocumentArray } from 'modules/track/interface'
import { ITrackDocument } from 'modules/track/model'
import { ITrackRepository } from 'modules/track/repository'

export interface IGetAllTracksServiceFilter
  extends Omit<GetAllTracksQuery, 'album'>,
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
