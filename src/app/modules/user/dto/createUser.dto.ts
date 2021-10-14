import { IsEmail, IsString, Length } from 'class-validator'

import { isString, lengthRange } from 'lib/class-validator/messages'

class CreateUserDto {
  @IsString({
    message: isString,
  })
  @Length(3, 30, {
    message: lengthRange,
  })
  username!: string

  @IsEmail()
  email!: string

  @IsString({
    message: isString,
  })
  @Length(3, 50, {
    message: lengthRange,
  })
  password!: string
}

export default CreateUserDto
