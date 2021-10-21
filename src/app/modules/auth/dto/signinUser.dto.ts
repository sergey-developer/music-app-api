import { IsEmail, IsString } from 'class-validator'

import messages from 'lib/class-validator/messages'
import { IUserDocument } from 'modules/user/model'

class SigninUserDto {
  @IsEmail()
  email!: IUserDocument['email']

  @IsString({
    message: messages.string,
  })
  password!: IUserDocument['password']
}

export default SigninUserDto
