import { Expose } from 'class-transformer'
import { IsEmail, IsString, Length } from 'class-validator'

import { stringMessages } from 'shared/constants/validation'

class CreateUserDto {
  @Expose()
  @IsString({
    message: stringMessages.isString,
  })
  @Length(3, 30, {
    message: stringMessages.length,
  })
  username!: string

  @Expose()
  @IsEmail()
  email!: string

  @Expose()
  @IsString({
    message: stringMessages.isString,
  })
  @Length(3, 50, {
    message: stringMessages.length,
  })
  password!: string
}

export default CreateUserDto
