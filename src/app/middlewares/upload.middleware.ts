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

const upload = multer({ storage })

export default upload
