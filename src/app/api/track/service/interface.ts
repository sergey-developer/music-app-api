import { CreateTrackDto, GetAllTracksQuery } from 'api/track/dto'
import { ITrackDocumentArray } from 'api/track/interface'
import { ITrackDocument } from 'api/track/model'
import { IUserDocument } from 'api/user/model'
import { DocumentId } from 'database/interface/document'

export interface IGetAllTracksServiceFilter extends GetAllTracksQuery {}

export interface ICreateTrackServicePayload extends CreateTrackDto {
  userId: DocumentId<IUserDocument>
}

export interface ITrackService {
  getAll: (filter: IGetAllTracksServiceFilter) => Promise<ITrackDocumentArray>

  createOne: (payload: ICreateTrackServicePayload) => Promise<ITrackDocument>
}
