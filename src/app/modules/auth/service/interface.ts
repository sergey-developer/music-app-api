import {
  SigninUserDto,
  SigninUserResultDto,
  SignupUserDto,
  SignupUserResultDto,
} from 'modules/auth/dto'

interface ISigninUserPayload extends SigninUserDto {}

interface ISignupUserPayload extends SignupUserDto {}

export interface IAuthService {
  signin: (payload: ISigninUserPayload) => Promise<SigninUserResultDto>

  signup: (payload: ISignupUserPayload) => Promise<SignupUserResultDto>
}
