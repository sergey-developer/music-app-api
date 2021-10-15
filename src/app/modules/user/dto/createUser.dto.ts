import { IsEmail, IsString, Length } from 'class-validator'

import messages from 'lib/class-validator/messages'
import {
  MAX_LENGTH_PASSWORD,
  MAX_LENGTH_USERNAME,
  MIN_LENGTH_PASSWORD,
  MIN_LENGTH_USERNAME,
} from 'modules/user/constants'

class CreateUserDto {
  @IsString({
    message: messages.string,
  })
  @Length(MIN_LENGTH_USERNAME, MAX_LENGTH_USERNAME, {
    message: messages.lengthRange,
  })
  username!: string

  @IsEmail()
  email!: string

  @IsString({
    message: messages.string,
  })
  @Length(MIN_LENGTH_PASSWORD, MAX_LENGTH_PASSWORD, {
    message: messages.lengthRange,
  })
  password!: string
}

export default CreateUserDto
