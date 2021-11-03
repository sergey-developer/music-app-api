import * as db from 'database/utils/db'
import { IUserDocument, UserModel } from 'modules/user/model'
import { preSaveHook } from 'modules/user/model/utils'

describe('User model', () => {
  describe('Pre save hook', () => {
    it('Password field was modified and password was generated', async () => {
      const notHashedPassword = '12345678'
      const nextFn = jest.fn()
      const fnContext: Pick<IUserDocument, 'password' | 'isModified'> = {
        password: notHashedPassword,
        isModified: jest.fn().mockReturnValueOnce(true),
      }

      await preSaveHook.call(fnContext, nextFn, {})

      expect(fnContext.isModified).toHaveBeenCalledWith('password')
      expect(fnContext.password).not.toBe(notHashedPassword)
      expect(nextFn).toHaveBeenCalledTimes(1)
    })

    it('Password field was not modified and password was not generated', async () => {
      const notHashedPassword = '87654321'
      const nextFn = jest.fn()
      const fnContext: Pick<IUserDocument, 'password' | 'isModified'> = {
        password: notHashedPassword,
        isModified: jest.fn().mockReturnValueOnce(false),
      }

      await preSaveHook.call(fnContext, nextFn, {})

      expect(fnContext.isModified).toHaveBeenCalledWith('password')
      expect(fnContext.password).toBe(notHashedPassword)
      expect(nextFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('Check password', () => {
    const createUserPayload: Pick<
      IUserDocument,
      'username' | 'email' | 'password'
    > = {
      username: 'User 1',
      email: 'user1@mail.ru',
      password: '12345678',
    }

    let user: IUserDocument

    beforeAll(async () => {
      await db.connect()
    })

    afterEach(async () => {
      await db.clear()
    })

    afterAll(async () => {
      await db.drop()
      await db.disconnect()
    })

    beforeEach(async () => {
      const newUser = new UserModel(createUserPayload)
      user = await newUser.save()
    })

    it('Checking is successful with correct password', async () => {
      const passwordIsMatched: boolean = await user.checkPassword(
        createUserPayload.password,
      )

      expect(passwordIsMatched).toBe(true)
    })

    it('Checking is failure with not correct password', async () => {
      const passwordToCheck: string = '12345677'

      const passwordIsMatched: boolean = await user.checkPassword(
        passwordToCheck,
      )

      expect(passwordIsMatched).toBe(false)
    })
  })
})
