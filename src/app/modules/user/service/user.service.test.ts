import { container as DiContainer } from 'tsyringe'

import { getFakeEmail } from '__tests__/fakeData/common'
import { fakeCreateUserPayload } from '__tests__/fakeData/user'
import { setupDB } from '__tests__/utils'
import EntityNamesEnum from 'database/constants/entityNamesEnum'
import generateMongoId from 'database/utils/generateMongoId'
import getModelName from 'database/utils/getModelName'
import { UserRoleEnum } from 'modules/user/constants'
import { UserModel } from 'modules/user/model'
import { UserService } from 'modules/user/service'
import {
  AppNotFoundError,
  AppValidationError,
} from 'shared/utils/errors/appErrors'
import {
  isBadRequestError,
  isNotFoundError,
} from 'shared/utils/errors/httpErrors'

let userService: UserService

setupDB()

beforeEach(() => {
  DiContainer.clearInstances()
  DiContainer.register(getModelName(EntityNamesEnum.User), {
    useValue: UserModel,
  })

  userService = DiContainer.resolve(UserService)
})

describe('User service', () => {
  describe('Get one user by email', () => {
    let getOneByEmailSpy: jest.SpyInstance

    beforeEach(async () => {
      getOneByEmailSpy = jest.spyOn(userService, 'getOneByEmail')
    })

    it('which exists', async () => {
      const userPayload = fakeCreateUserPayload()
      const newUser = await userService.createOne(userPayload)
      const user = await userService.getOneByEmail(newUser.email)

      expect(getOneByEmailSpy).toBeCalledTimes(1)
      expect(getOneByEmailSpy).toBeCalledWith(newUser.email)
      expect(user.email).toBe(newUser.email)
    })

    it('which not exist and throw not found error', async () => {
      const fakeEmail = getFakeEmail()

      try {
        const user = await userService.getOneByEmail(fakeEmail)
        expect(user).not.toBeDefined()
      } catch (error) {
        expect(getOneByEmailSpy).toBeCalledTimes(1)
        expect(getOneByEmailSpy).toBeCalledWith(fakeEmail)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })
  })

  describe('Create one user', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(async () => {
      createOneSpy = jest.spyOn(userService, 'createOne')
    })

    it('with correct data', async () => {
      const userPayload = fakeCreateUserPayload()
      const newUser = await userService.createOne(userPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(userPayload)
      expect(typeof newUser.id).toBe('string')
      expect(newUser.id).toBeTruthy()
      expect(newUser.username).toBe(userPayload.username)
      expect(newUser.email).toBe(userPayload.email)
      expect(newUser.password).not.toBe(userPayload.password)
      expect(newUser.role).toBe(UserRoleEnum.User)
    })

    it('with incorrect data and throw validation error', async () => {
      const userPayload = fakeCreateUserPayload(null, { isIncorrect: true })

      try {
        const newUser = await userService.createOne(userPayload)
        expect(newUser).not.toBeDefined()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(userPayload)
        expect(error).toBeInstanceOf(AppValidationError)
      }
    })
  })

  describe('Delete one user by id', () => {
    let deleteOneByIdSpy: jest.SpyInstance

    beforeEach(async () => {
      deleteOneByIdSpy = jest.spyOn(userService, 'deleteOneById')
    })

    it('which exists', async () => {
      const userPayload = fakeCreateUserPayload()
      const newUser = await userService.createOne(userPayload)
      const deletedUser = await userService.deleteOneById(newUser.id)

      expect(deleteOneByIdSpy).toBeCalledTimes(1)
      expect(deleteOneByIdSpy).toBeCalledWith(newUser.id)
      expect(deletedUser.id).toBe(newUser.id)
      expect(deletedUser.username).toBe(newUser.username)
      expect(deletedUser.password).toBe(newUser.password)
      expect(deletedUser.email).toBe(newUser.email)
      expect(deletedUser.role).toBe(newUser.role)
    })

    it('which not exist and throw not found error', async () => {
      const fakeMongoId = generateMongoId()

      try {
        const deletedUser = await userService.deleteOneById(fakeMongoId)
        expect(deletedUser).not.toBeDefined()
      } catch (error) {
        expect(deleteOneByIdSpy).toBeCalledTimes(1)
        expect(deleteOneByIdSpy).toBeCalledWith(fakeMongoId)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })
  })
})
