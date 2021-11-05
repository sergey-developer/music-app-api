import generateMongoId from 'database/utils/generateMongoId'
import { getFakeEmail } from 'fakeData/common'
import { JwtPayload } from 'modules/session/interface'
import { generateToken } from 'modules/session/model/session.model'
import { UserRoleEnum } from 'modules/user/constants'

describe('Session model', () => {
  it('generate token in static method', () => {
    const generateTokenSpy = jest.fn(generateToken)

    const jwtPayload: JwtPayload = {
      email: getFakeEmail(),
      role: UserRoleEnum.User,
      userId: generateMongoId(),
    }

    const token = generateTokenSpy(jwtPayload)

    expect(generateTokenSpy).toBeCalledTimes(1)
    expect(generateTokenSpy).toBeCalledWith(jwtPayload)
    expect(typeof token).toBe('string')
    expect(token).toBeTruthy()
  })
})
