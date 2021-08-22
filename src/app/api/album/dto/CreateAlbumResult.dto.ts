import { IAlbumModel } from 'api/album/model'
import { PickModelId } from 'shared/interface/utils/model'

interface CreateAlbumResultDto extends PickModelId<IAlbumModel> {}

export default CreateAlbumResultDto
