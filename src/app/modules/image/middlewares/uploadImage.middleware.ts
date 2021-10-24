import config from 'config'
import { RequestHandler } from 'express'
import multer from 'multer'

import logger from 'lib/logger'
import { createStorage, isMulterError } from 'lib/multer'
import { IMAGE_MIME_TYPE_ERROR_MSG } from 'modules/image/constants'
import { isAllowedMimetype } from 'modules/image/utils'
import {
  BadRequestError,
  ServerError,
  isBadRequestError,
} from 'shared/utils/errors/httpErrors'

const storage = createStorage(config.get('app.uploads.imagesDir'))

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    let errMsg
    console.log({ file })

    if (!isAllowedMimetype(file.mimetype)) {
      errMsg = IMAGE_MIME_TYPE_ERROR_MSG
    }

    // if (file.size) {
    //   errorMessage = ''
    // }

    errMsg ? cb(BadRequestError(errMsg)) : cb(null, true)
  },
}).single('image')

const uploadImage: RequestHandler = (req, res, next) => {
  upload(req, res, (err: any) => {
    if (isMulterError(err) || isBadRequestError(err)) {
      const error = BadRequestError(err.message)
      res.status(error.status).send(error)
      return
    }

    if (err) {
      logger.error(err.stack, {
        message: 'An unknown error while uploading image',
      })

      const error = ServerError()
      res.status(error.status).send(error)
    }

    next()
  })
}

export default uploadImage
