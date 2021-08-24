import { IArtistDocument } from 'api/artist/model'
import { PickDocumentId } from 'database/interface/document'

interface CreateArtistResultDto extends PickDocumentId<IArtistDocument> {}

export default CreateArtistResultDto
