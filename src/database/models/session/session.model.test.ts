import { fakeRepoSessionPayload } from '__tests__/fakeData/session'
import { SessionModel } from 'database/models/session'

describe('Session model', () => {
  it('successful generate token by static method', () => {
    const generateTokenSpy = jest.spyOn(SessionModel, 'generateToken')
    const jwtPayload = fakeRepoSessionPayload()
    const token = SessionModel.generateToken(jwtPayload)

    expect(generateTokenSpy).toBeCalledTimes(1)
    expect(generateTokenSpy).toBeCalledWith(jwtPayload)
    expect(token).toBeTruthy()
  })
})
