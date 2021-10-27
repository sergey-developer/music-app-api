import { EntityNamesEnum } from 'database/constants/entityNames'
import { checkString } from 'shared/utils/common'

const isArtistModelName = checkString(EntityNamesEnum.Artist)
const isAlbumModelName = checkString(EntityNamesEnum.Album)
const isTrackModelName = checkString(EntityNamesEnum.Track)

export { isArtistModelName, isAlbumModelName, isTrackModelName }
