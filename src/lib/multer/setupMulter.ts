import multer from 'multer'

const setupMulter = (
  storage: multer.StorageEngine,
  allowedMimeType: Function,
  mimeTypeErrorMsg: string,
): multer.Multer => {
  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (allowedMimeType(file.mimetype)) {
        cb(null, true)
      } else {
        // TODO: test Error
        return cb(new Error(mimeTypeErrorMsg))
      }
    },
  })
}

export default setupMulter
