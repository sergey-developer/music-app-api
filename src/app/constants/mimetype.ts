const ALLOWED_IMAGE_EXTENSIONS: string[] = ['png', 'jpg', 'jpeg']

const IMAGE_EXTENSIONS: string = ALLOWED_IMAGE_EXTENSIONS.map(
  (ext) => `.${ext}`,
).join(', ')

export const ALLOWED_IMAGE_MIMETYPES: string[] = ALLOWED_IMAGE_EXTENSIONS.map(
  (ext) => `image/${ext}`,
)

export const IMAGE_MIME_TYPE_ERROR_MSG: string = `Only ${IMAGE_EXTENSIONS} format allowed`
