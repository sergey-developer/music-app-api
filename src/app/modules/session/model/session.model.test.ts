import { fakeJwtPayload } from 'fakeData/session'
import { generateToken } from 'modules/session/model/session.model'

describe('Session model', () => {
  it('successful generate token by static method', () => {
    const generateTokenSpy = jest.fn(generateToken)
    const jwtPayload = fakeJwtPayload()
    const token = generateTokenSpy(jwtPayload)

    expect(generateTokenSpy).toBeCalledTimes(1)
    expect(generateTokenSpy).toBeCalledWith(jwtPayload)
    expect(typeof token).toBe('string')
    expect(token).toBeTruthy()
  })
})
