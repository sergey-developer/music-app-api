import { CreateTrackDto } from 'api/track/dto'
import { ITrackDocument } from 'api/track/model'
import { ITrackRepository } from 'api/track/repository'
import { IUserDocument } from 'api/user/model'
import { DocumentId } from 'database/interface/document'

export interface ICreateTrackServicePayload extends CreateTrackDto {
  userId: DocumentId<IUserDocument>
}

export interface ITrackService {
  getAll: ITrackRepository['findAllWhere']
  createOne: (payload: ICreateTrackServicePayload) => Promise<ITrackDocument>
}
