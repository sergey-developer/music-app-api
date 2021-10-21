import {
  SigninUserDto,
  SigninUserResultDto,
  SignupUserDto,
  SignupUserResultDto,
} from 'modules/auth/dto'
import { JwtToken } from 'modules/session/interface'

interface ISigninUserPayload extends SigninUserDto {}

interface ISignupUserPayload extends SignupUserDto {}

export interface IAuthService {
  signin: (payload: ISigninUserPayload) => Promise<SigninUserResultDto>

  signup: (payload: ISignupUserPayload) => Promise<SignupUserResultDto>

  logout: (token: JwtToken) => Promise<void>
}
