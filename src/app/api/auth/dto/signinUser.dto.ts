import { IsEmail, IsString } from 'class-validator'

import { stringMessages } from 'shared/constants/validator'

class SigninUserDto {
  @IsEmail()
  email!: string

  @IsString({
    message: stringMessages.isString,
  })
  password!: string
}

export default SigninUserDto
