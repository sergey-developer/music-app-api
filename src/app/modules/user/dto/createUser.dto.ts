import { IsEmail, IsString, Length } from 'class-validator'

import { isString, lengthRange } from 'lib/class-validator/messages'
import {
  MAX_LENGTH_PASSWORD,
  MAX_LENGTH_USERNAME,
  MIN_LENGTH_PASSWORD,
  MIN_LENGTH_USERNAME,
} from 'modules/user/constants'

class CreateUserDto {
  @IsString({
    message: isString,
  })
  @Length(MIN_LENGTH_USERNAME, MAX_LENGTH_USERNAME, {
    message: lengthRange,
  })
  username!: string

  @IsEmail()
  email!: string

  @IsString({
    message: isString,
  })
  @Length(MIN_LENGTH_PASSWORD, MAX_LENGTH_PASSWORD, {
    message: lengthRange,
  })
  password!: string
}

export default CreateUserDto
