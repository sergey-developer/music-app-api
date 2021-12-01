import { checkString } from 'app/utils/common'
import { EntityNamesEnum } from 'database/constants'

const isArtistModelName = checkString(EntityNamesEnum.Artist)
const isAlbumModelName = checkString(EntityNamesEnum.Album)
const isTrackModelName = checkString(EntityNamesEnum.Track)

export { isArtistModelName, isAlbumModelName, isTrackModelName }
