import { Expose } from 'class-transformer'
import { IsEmail, IsString } from 'class-validator'

import { stringMessages } from 'shared/constants/validation'

class SigninUserDto {
  @Expose()
  @IsEmail()
  email!: string

  @Expose()
  @IsString({
    message: stringMessages.isString,
  })
  password!: string
}

export default SigninUserDto
