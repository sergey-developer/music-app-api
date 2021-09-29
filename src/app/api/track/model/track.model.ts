import { Schema, model } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

import { AlbumModel, IAlbumDocument } from 'api/album/model'
import { IArtistDocument } from 'api/artist/model'
import { ITrackDocumentArray } from 'api/track/interface'
import { ITrackDocument, ITrackModel } from 'api/track/model'
import { IGetAllTracksRepositoryFilter } from 'api/track/repository'
import { DocumentId } from 'database/interface/document'

const toJson = require('@meanie/mongoose-to-json')

const TrackSchema = new Schema<ITrackDocument, ITrackModel, ITrackDocument>({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  youtube: {
    type: String,
    unique: true,
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: AlbumModel.modelName,
    required: true,
    autopopulate: true,
  },
})

TrackSchema.static(
  'findByArtistId',
  async function (
    id: DocumentId<IArtistDocument>,
    filter: IGetAllTracksRepositoryFilter,
  ) {
    const tracks: ITrackDocumentArray = await this.find(filter).exec()

    return tracks.filter((track) => {
      const album = track.album as IAlbumDocument
      const artist = album.artist as IArtistDocument
      return artist.id === id
    })
  },
)

TrackSchema.plugin(toJson)
TrackSchema.plugin(autopopulate)

const TrackModel = model<ITrackDocument, ITrackModel>('Track', TrackSchema)

export default TrackModel
