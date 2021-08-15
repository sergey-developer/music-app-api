import { IArtistModel } from 'api/artist/model'

interface CreateArtistResultDto extends Pick<IArtistModel, 'id'> {}

export default CreateArtistResultDto
