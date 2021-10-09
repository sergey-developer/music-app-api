import { FilterQuery, Model } from 'mongoose'

import { IAlbumDocument } from 'api/album/model'
import { ITrackDocumentArray } from 'api/track/interface'
import { DocumentId, PopulatedDoc } from 'database/interface/document'

export interface ITrackDocument {
  id: string
  name: string
  duration: string
  album: PopulatedDoc<IAlbumDocument>
  youtube?: string
}

export interface ITrackModel extends Model<ITrackDocument> {
  findByArtistId(
    id: DocumentId,
    filter: FilterQuery<ITrackDocument>,
  ): Promise<ITrackDocumentArray>
}
