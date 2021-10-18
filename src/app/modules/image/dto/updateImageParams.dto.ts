import { IsString } from 'class-validator'

import messages from 'lib/class-validator/messages'

class UpdateImageParams {
  @IsString({
    message: messages.string,
  })
  filename!: string
}

export default UpdateImageParams
