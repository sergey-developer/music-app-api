import { IArtistModel } from 'api/artist/model'
import { PickModelId } from 'shared/interface/utils/model'

interface CreateArtistResultDto extends PickModelId<IArtistModel> {}

export default CreateArtistResultDto
