import {
  SigninUserDto,
  SigninUserResultDto,
  SignupUserDto,
  SignupUserResultDto,
} from 'modules/auth/dto'

interface ISigninUserServicePayload extends SigninUserDto {}

interface ISignupUserServicePayload extends SignupUserDto {}

export interface IAuthService {
  signin: (payload: ISigninUserServicePayload) => Promise<SigninUserResultDto>

  signup: (payload: ISignupUserServicePayload) => Promise<SignupUserResultDto>
}
