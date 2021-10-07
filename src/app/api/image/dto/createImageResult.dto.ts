import { IImageDocument } from 'api/image/model'

interface CreateImageResultDto extends Pick<IImageDocument, 'id' | 'src'> {}

export default CreateImageResultDto
