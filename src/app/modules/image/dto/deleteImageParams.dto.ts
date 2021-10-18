import { IsString } from 'class-validator'

import messages from 'lib/class-validator/messages'

class DeleteImageParams {
  @IsString({
    message: messages.string,
  })
  filename!: string
}

export default DeleteImageParams
