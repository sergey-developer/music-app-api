import { FilterQuery, Schema, model } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

import { EntityNamesEnum } from 'database/constants'
import { DocumentId } from 'database/interface/document'
import { IAlbumDocument } from 'database/models/album'
import { IArtistDocument } from 'database/models/artist'
import {
  ITrackDocument,
  ITrackDocumentArray,
  ITrackModel,
  MAX_LENGTH_TRACK_NAME,
  MIN_LENGTH_TRACK_DURATION,
  MIN_LENGTH_TRACK_NAME,
} from 'database/models/track'

const toJson = require('@meanie/mongoose-to-json')
const uniqueValidation = require('mongoose-unique-validator')

const TrackSchema = new Schema<ITrackDocument, ITrackModel, ITrackDocument>({
  name: {
    type: String,
    required: true,
    minlength: MIN_LENGTH_TRACK_NAME,
    maxlength: MAX_LENGTH_TRACK_NAME,
  },
  duration: {
    type: Number,
    required: true,
    minlength: MIN_LENGTH_TRACK_DURATION,
  },
  youtube: {
    type: String,
    unique: 'Track with such link "{VALUE}" already exists',
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: EntityNamesEnum.Album,
    required: true,
    autopopulate: true,
  },
})

// TODO: найти способ сделать это через базу данных
TrackSchema.static(
  'findByArtistId',
  async function (artistId: DocumentId, filter: FilterQuery<ITrackDocument>) {
    const tracks: ITrackDocumentArray = await this.find(filter).exec()

    return tracks.filter((track) => {
      if (track.album) {
        const album = track.album as IAlbumDocument

        if (album.artist) {
          const artist = album.artist as unknown as IArtistDocument
          return artist.id === artistId
        }
      }

      return false
    })
  },
)

TrackSchema.plugin(toJson)
TrackSchema.plugin(autopopulate)
TrackSchema.plugin(uniqueValidation)

const TrackModel = model<ITrackDocument, ITrackModel>(
  EntityNamesEnum.Track,
  TrackSchema,
)

export default TrackModel
