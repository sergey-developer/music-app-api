import config from 'config'
import multer from 'multer'

import { createStorage } from 'lib/multer'
import { IMAGE_MIME_TYPE_ERROR_MSG } from 'modules/image/constants'
import { isAllowedMimetype } from 'modules/image/utils'

const storage = createStorage(config.get('app.uploads.imagesDir'))

const uploadImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (isAllowedMimetype(file.mimetype)) {
      cb(null, true)
    } else {
      // TODO: test Error
      return cb(new Error(IMAGE_MIME_TYPE_ERROR_MSG))
    }
  },
})

export default uploadImage
