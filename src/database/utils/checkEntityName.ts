import { stringEqual } from 'app/utils/common'
import { EntityNamesEnum } from 'database/constants'

const isArtistModelName = stringEqual(EntityNamesEnum.Artist)
const isAlbumModelName = stringEqual(EntityNamesEnum.Album)
const isTrackModelName = stringEqual(EntityNamesEnum.Track)

export { isArtistModelName, isAlbumModelName, isTrackModelName }
