import { Schema, model } from 'mongoose'

import { AlbumModel, IAlbumDocument } from 'api/album/model'
import { IArtistDocument } from 'api/artist/model'
import { GetAllTracksFilter, TrackDocumentArray } from 'api/track/interface'
import { ITrackDocument, ITrackModel } from 'api/track/model'
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
  published: {
    type: Boolean,
    default: false,
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: AlbumModel.modelName,
    required: true,
  },
})

TrackSchema.static(
  'findByArtistId',
  async function (id: DocumentId<IArtistDocument>, filter: GetAllTracksFilter) {
    const tracks: TrackDocumentArray = await this.find(filter, null).populate({
      path: 'album',
      populate: { path: 'artist' },
    })

    return tracks.filter((track) => {
      const album = track.album as IAlbumDocument
      const artist = album.artist as IArtistDocument
      return artist.id === id
    })
  },
)

TrackSchema.plugin(toJson)

const TrackModel = model<ITrackDocument, ITrackModel>('Track', TrackSchema)

export default TrackModel
