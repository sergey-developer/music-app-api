import { IsEmail, IsString } from 'class-validator'

import { isString } from 'lib/class-validator/messages'

class SigninUserDto {
  @IsEmail()
  email!: string

  @IsString({
    message: isString,
  })
  password!: string
}

export default SigninUserDto
