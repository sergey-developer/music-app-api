import { IImageDocument } from 'modules/image/model'

interface UpdateImageResultDto
  extends Pick<IImageDocument, 'src' | 'fileName'> {}

export default UpdateImageResultDto
