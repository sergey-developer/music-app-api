import { IsEmail, IsString } from 'class-validator'

import messages from 'lib/class-validator/messages'

class SigninUserDto {
  @IsEmail()
  email!: string

  @IsString({
    message: messages.string,
  })
  password!: string
}

export default SigninUserDto
