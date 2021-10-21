import { IMulterFile } from 'lib/multer'
import { IImageDocument } from 'modules/image/model'

interface UpdateImageDto extends IMulterFile {
  currentFileName: IImageDocument['fileName']
}

export default UpdateImageDto
