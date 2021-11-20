import config from 'config'
import { RequestHandler } from 'express'
import multer from 'multer'

import logger from 'lib/logger'
import { createStorage, isMulterError } from 'lib/multer'
import AppErrorKindsEnum from 'shared/constants/appErrorKindsEnum'
import { TWO_MEGABYTES } from 'shared/constants/bytesSize'
import { VALIDATION_ERR_MSG } from 'shared/constants/errorMessages'
import { IMAGE_MIME_TYPE_ERROR_MSG } from 'shared/constants/mimetype'
import {
  BadRequestError,
  ServerError,
  isBadRequestError,
} from 'shared/utils/errors/httpErrors'
import { isAllowedImageMimetype } from 'shared/utils/file'

const storage = createStorage(config.get('app.uploads.imagesDir'))

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    let errMsg: string = ''

    if (!isAllowedImageMimetype(file.mimetype)) {
      errMsg = IMAGE_MIME_TYPE_ERROR_MSG
    }

    errMsg ? cb(BadRequestError(errMsg)) : cb(null, true)
  },
  limits: {
    fileSize: TWO_MEGABYTES,
  },
})

const uploadImage =
  (fieldName: string): RequestHandler =>
  (req, res, next) => {
    upload.single(fieldName)(req, res, (err: any) => {
      if (isMulterError(err) || isBadRequestError(err)) {
        const error = BadRequestError(VALIDATION_ERR_MSG, {
          kind: AppErrorKindsEnum.ValidationError,
          errors: { [fieldName]: [err.message] },
        })

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

export { storage }

export default uploadImage
