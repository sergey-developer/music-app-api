import { IAlbumDocument } from 'api/album/model'
import { PickDocumentId } from 'database/interface/document'

interface CreateAlbumResultDto extends PickDocumentId<IAlbumDocument> {}

export default CreateAlbumResultDto
