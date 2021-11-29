import { Document, FilterQuery, Model, PopulatedDoc } from 'mongoose'

import { DocumentId } from 'database/interface/document'
import { IAlbumDocument } from 'modules/album/model'
import { ITrackDocumentArray } from 'modules/track/interface'

export interface ITrackDocument extends Document {
  id: DocumentId
  name: string
  duration: number
  album: PopulatedDoc<IAlbumDocument>
  youtube?: string
}

export interface ITrackModel extends Model<ITrackDocument> {
  findByArtistId(
    id: ITrackDocument['id'],
    filter: FilterQuery<ITrackDocument>,
  ): Promise<ITrackDocumentArray>
}
