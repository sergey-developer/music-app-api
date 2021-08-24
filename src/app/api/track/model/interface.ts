import { Model } from 'mongoose'

import { IAlbumDocument } from 'api/album/model'
import { IArtistDocument } from 'api/artist/model'
import { GetAllTracksFilter, TrackDocumentArray } from 'api/track/interface'
import {
  CustomDocument,
  DocumentId,
  PopulatedDoc,
} from 'database/interface/document'

export interface ITrackDocument extends CustomDocument {
  name: string
  duration: string
  published: boolean
  album: PopulatedDoc<IAlbumDocument>
  youtube?: string
}

export interface ITrackModel extends Model<ITrackDocument> {
  findByArtistId(
    id: DocumentId<IArtistDocument>,
    filter: GetAllTracksFilter,
  ): Promise<TrackDocumentArray>
}
