import { ModelNamesEnum } from 'database/constants'

type CheckModelNameFn = (
  checkingName: ModelNamesEnum,
) => (name: ModelNamesEnum) => boolean

const checkModelName: CheckModelNameFn = (checkingName) => {
  return (name) => name === checkingName
}

const isArtistModelName = checkModelName(ModelNamesEnum.Artist)
const isAlbumModelName = checkModelName(ModelNamesEnum.Album)
const isTrackModelName = checkModelName(ModelNamesEnum.Track)

export { isArtistModelName, isAlbumModelName, isTrackModelName }
