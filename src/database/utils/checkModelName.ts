import { ModelNamesEnum } from 'database/constants'
import { isSameString } from 'shared/utils/common'

const isArtistModelName = isSameString(ModelNamesEnum.Artist)
const isAlbumModelName = isSameString(ModelNamesEnum.Album)
const isTrackModelName = isSameString(ModelNamesEnum.Track)

export { isArtistModelName, isAlbumModelName, isTrackModelName }
