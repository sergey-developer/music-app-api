import { fakeSessionPayload } from '__tests__/fakeData/session'
import { SessionModel } from 'modules/session/model'

describe('Session model', () => {
  it('successful generate token by static method', () => {
    const generateTokenSpy = jest.spyOn(SessionModel, 'generateToken')
    const jwtPayload = fakeSessionPayload()
    const token = SessionModel.generateToken(jwtPayload)

    expect(generateTokenSpy).toBeCalledTimes(1)
    expect(generateTokenSpy).toBeCalledWith(jwtPayload)
    expect(typeof token).toBe('string')
    expect(token).toBeTruthy()
  })
})
