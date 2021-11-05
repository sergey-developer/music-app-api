import { fakeCreateSessionPayload } from '__tests__/fakeData/session'
import * as sessionUtils from 'modules/session/utils'

describe('verifyToken', () => {
  it('successful with correct arguments', () => {
    const verifyTokenSpy = jest.spyOn(sessionUtils, 'verifyToken')

    const jwtPayload = fakeCreateSessionPayload()
    const fakeSecret = 'fakeSecret'

    const token = sessionUtils.generateToken(jwtPayload, fakeSecret)
    const verifiedJwtPayload = sessionUtils.verifyToken(token, fakeSecret)

    expect(verifyTokenSpy).toBeCalledTimes(1)
    expect(verifyTokenSpy).toBeCalledWith(token, fakeSecret)
    expect(verifiedJwtPayload.role).toBe(jwtPayload.role)
    expect(verifiedJwtPayload.email).toBe(jwtPayload.email)
    expect(verifiedJwtPayload.userId).toBe(jwtPayload.userId)
  })
})
