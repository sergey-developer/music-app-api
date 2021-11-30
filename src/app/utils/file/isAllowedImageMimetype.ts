import { ALLOWED_IMAGE_MIMETYPES } from 'app/constants/mimetype'

const isAllowedImageMimetype = (mimetype: string): boolean => {
  return ALLOWED_IMAGE_MIMETYPES.includes(mimetype)
}

export default isAllowedImageMimetype
