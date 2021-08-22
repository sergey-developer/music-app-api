import { ITrackModel } from 'api/track/model'
import { PickModelId } from 'shared/interface/utils/model'

interface CreateTrackResultDto extends PickModelId<ITrackModel> {}

export default CreateTrackResultDto
