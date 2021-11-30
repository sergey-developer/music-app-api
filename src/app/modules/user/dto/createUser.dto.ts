import { IsEmail, IsString, Length } from 'class-validator'

import {
  IUserDocument,
  MAX_LENGTH_PASSWORD,
  MAX_LENGTH_USERNAME,
  MIN_LENGTH_PASSWORD,
  MIN_LENGTH_USERNAME,
} from 'database/models/user'
import messages from 'lib/class-validator/messages'

class CreateUserDto {
  @IsString({
    message: messages.string,
  })
  @Length(MIN_LENGTH_USERNAME, MAX_LENGTH_USERNAME, {
    message: messages.lengthRange,
  })
  username!: IUserDocument['username']

  @IsEmail()
  email!: IUserDocument['email']

  @IsString({
    message: messages.string,
  })
  @Length(MIN_LENGTH_PASSWORD, MAX_LENGTH_PASSWORD, {
    message: messages.lengthRange,
  })
  password!: IUserDocument['password']
}

export default CreateUserDto
