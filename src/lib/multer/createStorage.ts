import multer, { StorageEngine } from 'multer'

import { uniqFilename } from 'shared/utils/file'

const createStorage = (uploadPath: string): StorageEngine => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      cb(null, uniqFilename(file.originalname))
    },
  })
}

export default createStorage
