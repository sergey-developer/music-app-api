import { IsEmail, IsString } from 'class-validator'

import { IUserDocument } from 'database/models/user'
import messages from 'lib/class-validator/messages'

class SigninUserDto {
  @IsEmail()
  email!: IUserDocument['email']

  @IsString({
    message: messages.string,
  })
  password!: IUserDocument['password']
}

export default SigninUserDto
