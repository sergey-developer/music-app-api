import { ITrackRepository } from 'api/track/repository'

export interface ITrackService {
  getAll: ITrackRepository['findAllWhere']
  createOne: ITrackRepository['createOne']
}
