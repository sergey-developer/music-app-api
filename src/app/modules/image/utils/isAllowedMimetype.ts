import { ALLOWED_IMAGE_MIMETYPES } from 'modules/image/constants'

const isAllowedMimetype = (mimetype: string): boolean => {
  return ALLOWED_IMAGE_MIMETYPES.includes(mimetype)
}

export default isAllowedMimetype
