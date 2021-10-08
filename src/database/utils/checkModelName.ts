import { ModelNamesEnum } from 'database/constants'
import { checkString } from 'shared/utils/common'

const isArtistModelName = checkString(ModelNamesEnum.Artist)
const isAlbumModelName = checkString(ModelNamesEnum.Album)
const isTrackModelName = checkString(ModelNamesEnum.Track)

export { isArtistModelName, isAlbumModelName, isTrackModelName }
