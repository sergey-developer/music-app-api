import { Model } from 'mongoose'

import { IAlbumDocument } from 'api/album/model'
import { IArtistDocument } from 'api/artist/model'
import { TrackDocumentArray } from 'api/track/interface'
import { IGetAllTracksRepositoryFilter } from 'api/track/repository'
import {
  CustomDocument,
  DocumentId,
  PopulatedDoc,
} from 'database/interface/document'

export interface ITrackDocument extends CustomDocument {
  name: string
  duration: string
  album: PopulatedDoc<IAlbumDocument>
  youtube?: string
}

export interface ITrackModel extends Model<ITrackDocument> {
  findByArtistId(
    id: DocumentId<IArtistDocument>,
    filter: IGetAllTracksRepositoryFilter,
  ): Promise<TrackDocumentArray>
}
