import { appConfig } from 'configs/app'
import { createStorage, setupMulter } from 'lib/multer'
import { IMAGE_MIME_TYPE_ERROR_MSG } from 'modules/image/constants'
import { isAllowedMimetype } from 'modules/image/utils'

const storage = createStorage(appConfig.imageUploadPath)

const uploadImage = setupMulter(
  storage,
  isAllowedMimetype,
  IMAGE_MIME_TYPE_ERROR_MSG,
)

export default uploadImage
