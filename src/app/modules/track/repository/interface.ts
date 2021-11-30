import { DeleteResult } from 'mongodb'

import { DocumentIdArray } from 'database/interface/document'
import { ITrackDocument } from 'database/models/track'
import { ITrackDocumentArray } from 'database/models/track'
import {
  CreateTrackDto,
  GetAllTracksQuery,
  UpdateTrackDto,
} from 'modules/track/dto'

export interface IFindAllTracksFilter
  extends Pick<GetAllTracksQuery, 'artist'>,
    Partial<{
      ids: DocumentIdArray
      albumIds: DocumentIdArray
    }> {}

export interface IFindOneTrackFilter
  extends Partial<{
    id: ITrackDocument['id']
  }> {}

export interface IUpdateOneTrackPayload extends UpdateTrackDto {}

export interface IUpdateOneTrackFilter
  extends Partial<{
    id: ITrackDocument['id']
  }> {}

export interface IDeleteOneTrackFilter
  extends Partial<{
    id: ITrackDocument['id']
  }> {}

export interface IDeleteManyTracksFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface ICreateOneTrackPayload
  extends Omit<CreateTrackDto, 'duration'> {
  duration: number
}

export interface ITrackRepository {
  findAllWhere: (filter: IFindAllTracksFilter) => Promise<ITrackDocumentArray>

  findOne: (filter: IFindOneTrackFilter) => Promise<ITrackDocument>

  createOne: (payload: ICreateOneTrackPayload) => Promise<ITrackDocument>

  updateOne: (
    filter: IUpdateOneTrackFilter,
    payload: IUpdateOneTrackPayload,
  ) => Promise<ITrackDocument>

  deleteOne: (filter: IDeleteOneTrackFilter) => Promise<ITrackDocument>

  deleteMany: (filter: IDeleteManyTracksFilter) => Promise<DeleteResult>
}
