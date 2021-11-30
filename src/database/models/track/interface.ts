import { Document, FilterQuery, Model, PopulatedDoc } from 'mongoose'

import { DocumentId } from 'database/interface/document'
import { IAlbumDocument } from 'database/models/album'

export interface ITrackDocument extends Document {
  id: DocumentId
  name: string
  duration: number
  album: PopulatedDoc<IAlbumDocument>
  youtube?: string
}

export interface ITrackDocumentArray extends Array<ITrackDocument> {}

export interface ITrackModel extends Model<ITrackDocument> {
  findByArtistId(
    id: ITrackDocument['id'],
    filter: FilterQuery<ITrackDocument>,
  ): Promise<ITrackDocumentArray>
}
