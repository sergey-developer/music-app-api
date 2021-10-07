import { ModelNamesEnum } from 'database/constants'

type CheckModelNameFn = (
  name: ModelNamesEnum,
) => (name: ModelNamesEnum) => boolean

const checkModelName: CheckModelNameFn = (name) => {
  return (anotherName) => name === anotherName
}

const isArtistModelName = checkModelName(ModelNamesEnum.Artist)
const isAlbumModelName = checkModelName(ModelNamesEnum.Album)
const isTrackModelName = checkModelName(ModelNamesEnum.Track)

export { isArtistModelName, isAlbumModelName, isTrackModelName }
