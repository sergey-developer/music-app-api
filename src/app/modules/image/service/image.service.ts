import fs from 'fs/promises'
import path from 'path'

import config from 'config'
import { singleton } from 'tsyringe'

import logger from 'lib/logger'
import { IImageService } from 'modules/image/service'

@singleton()
class ImageService implements IImageService {
  private readonly dir: string

  public constructor() {
    this.dir = config.get('app.uploads.imagesDir')
  }

  public deleteOneByName: IImageService['deleteOneByName'] = async (name) => {
    try {
      return fs.unlink(path.join(this.dir, name))
    } catch (error: any) {
      logger.warn(error.stack, {
        message: `Image with name "${name}" probably was not deleted from file system`,
      })
    }
  }

  public deleteManyByNames: IImageService['deleteManyByNames'] = async (
    names,
  ) => {
    const promises = names.map(this.deleteOneByName)
    return Promise.allSettled(promises)
  }
}

export default ImageService
