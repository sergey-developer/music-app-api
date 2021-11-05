import { fakeJwtPayload } from '__tests__/fakeData/session'
import * as sessionUtils from 'modules/session/utils'

describe('generateToken', () => {
  it('successful with correct arguments', () => {
    const generateTokenSpy = jest.spyOn(sessionUtils, 'generateToken')

    const jwtPayload = fakeJwtPayload()
    const fakeSecret = 'fakeSecret'

    const token = sessionUtils.generateToken(jwtPayload, fakeSecret)

    expect(generateTokenSpy).toBeCalledTimes(1)
    expect(generateTokenSpy).toBeCalledWith(jwtPayload, fakeSecret)
    expect(typeof token).toBe('string')
    expect(token).toBeTruthy()
  })
})
