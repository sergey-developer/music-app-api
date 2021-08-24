import { IImageDocument } from 'api/image/model'
import { PickDocumentId } from 'database/interface/document'

interface CreateImageResultDto extends PickDocumentId<IImageDocument> {}

export default CreateImageResultDto
