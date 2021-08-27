import path from 'path'

import multer from 'multer'
import { nanoid } from 'nanoid'

import { appConfig } from 'configs/app'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appConfig.uploadPath)
  },
  filename: function (req, file, cb) {
    cb(null, `${nanoid()}${path.extname(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
    }
  },
})

export default upload
