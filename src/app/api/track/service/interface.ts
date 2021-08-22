import { ITrackRepository } from 'api/track/repository'

export interface ITrackService {
  getAll: ITrackRepository['findAll']
  getAllWhere: ITrackRepository['findAllWhere']
  createOne: ITrackRepository['createOne']
}
