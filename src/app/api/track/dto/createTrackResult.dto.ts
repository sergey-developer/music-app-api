import { ITrackDocument } from 'api/track/model'
import { PickDocumentId } from 'database/interface/document'

interface CreateTrackResultDto extends PickDocumentId<ITrackDocument> {}

export default CreateTrackResultDto
