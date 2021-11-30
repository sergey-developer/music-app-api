import config from 'config'

import { deleteFileFromFs } from 'app/utils/file'

const deleteImageFromFs = (
  imageName: string,
): ReturnType<typeof deleteFileFromFs> =>
  deleteFileFromFs(config.get('app.uploads.imagesDir'), imageName)

export default deleteImageFromFs
