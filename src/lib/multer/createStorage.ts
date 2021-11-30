import multer, { StorageEngine } from 'multer'

import { uniqFileName } from 'app/utils/file'

const createStorage = (uploadPath: string): StorageEngine => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      cb(null, uniqFileName(file.originalname))
    },
  })
}

export default createStorage
