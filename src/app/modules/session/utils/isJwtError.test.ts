import { JsonWebTokenError } from 'jsonwebtoken'

import * as sessionUtils from 'modules/session/utils'

describe('isJwtError', () => {
  let isJwtErrorSpy: jest.SpyInstance

  beforeEach(() => {
    isJwtErrorSpy = jest.spyOn(sessionUtils, 'isJwtError')
  })

  afterEach(() => {
    isJwtErrorSpy.mockClear()
  })

  it('successful if provided error is correct', () => {
    const jwtError = new JsonWebTokenError('jwt error')
    const isJwtError = sessionUtils.isJwtError(jwtError)

    expect(isJwtErrorSpy).toBeCalledTimes(1)
    expect(isJwtErrorSpy).toBeCalledWith(jwtError)
    expect(isJwtError).toBe(true)
  })

  it('failure if provided error is incorrect', () => {
    const jwtError = new Error('not jwt error')
    const isJwtError = sessionUtils.isJwtError(jwtError)

    expect(isJwtErrorSpy).toBeCalledTimes(1)
    expect(isJwtErrorSpy).toBeCalledWith(jwtError)
    expect(isJwtError).toBe(false)
  })
})
