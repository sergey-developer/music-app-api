import { IImageDocument } from 'modules/image/model'

interface CreateImageResultDto
  extends Pick<IImageDocument, 'id' | 'src' | 'fileName'> {}

export default CreateImageResultDto
