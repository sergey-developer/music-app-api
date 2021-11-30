import { fakeRepoUserPayload, getFakePassword } from '__tests__/fakeData/user'
import setupDB from '__tests__/utils/setupDB'
import { preSaveHook } from 'database/models/user/hooks'
import { IUserDocument, UserModel } from 'database/models/user/index'

describe('User model', () => {
  describe('Pre save hook', () => {
    it('Password field was modified and password was generated', async () => {
      const notHashedPassword = getFakePassword()
      const nextFn = jest.fn()
      const fnContext: Pick<IUserDocument, 'password' | 'isModified'> = {
        password: notHashedPassword,
        isModified: jest.fn().mockReturnValueOnce(true),
      }

      await preSaveHook.call(fnContext, nextFn, {})

      expect(fnContext.isModified).toBeCalledWith('password')
      expect(fnContext.password).not.toBe(notHashedPassword)
      expect(nextFn).toBeCalledTimes(1)
    })

    it('Password field was not modified and password was not generated', async () => {
      const notHashedPassword = getFakePassword()
      const nextFn = jest.fn()
      const fnContext: Pick<IUserDocument, 'password' | 'isModified'> = {
        password: notHashedPassword,
        isModified: jest.fn().mockReturnValueOnce(false),
      }

      await preSaveHook.call(fnContext, nextFn, {})

      expect(fnContext.isModified).toBeCalledWith('password')
      expect(fnContext.password).toBe(notHashedPassword)
      expect(nextFn).toBeCalledTimes(1)
    })
  })

  describe('Check password', () => {
    const userPayload = fakeRepoUserPayload()

    let user: IUserDocument
    let checkPasswordSpy: jest.SpyInstance

    setupDB()

    beforeEach(async () => {
      const newUser = new UserModel(userPayload)
      user = await newUser.save()
      checkPasswordSpy = jest.spyOn(user, 'checkPassword')
    })

    it('successful with correct password', async () => {
      const passwordIsMatched = await user.checkPassword(userPayload.password)

      expect(checkPasswordSpy).toBeCalledTimes(1)
      expect(checkPasswordSpy).toBeCalledWith(userPayload.password)
      expect(passwordIsMatched).toBe(true)
    })

    it('failure with not correct password', async () => {
      const passwordToCheck = getFakePassword()
      const passwordIsMatched = await user.checkPassword(passwordToCheck)

      expect(checkPasswordSpy).toBeCalledTimes(1)
      expect(checkPasswordSpy).toBeCalledWith(passwordToCheck)
      expect(passwordIsMatched).toBe(false)
    })
  })
})
