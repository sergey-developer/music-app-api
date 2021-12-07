import { internet } from 'faker'
import { container as DiContainer } from 'tsyringe'

import { fakeServiceUserPayload } from '__tests__/fakeData/user'
import { setupDB } from '__tests__/utils'
import {
  AppNotFoundError,
  AppValidationError,
} from 'app/utils/errors/appErrors'
import { UserModel } from 'database/models/user'
import generateEntityId from 'database/utils/generateEntityId'
import { DiTokenEnum } from 'lib/dependency-injection'
import { UserService } from 'modules/user/service'

let userService: UserService

setupDB()

beforeEach(() => {
  DiContainer.clearInstances()

  DiContainer.register(DiTokenEnum.User, {
    useValue: UserModel,
  })

  userService = DiContainer.resolve(UserService)
})

describe('User service', () => {
  describe('Create one user', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(async () => {
      createOneSpy = jest.spyOn(userService, 'createOne')
    })

    it('with correct data', async () => {
      const userPayload = fakeServiceUserPayload()
      const newUser = await userService.createOne(userPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(userPayload)
      expect(newUser).toBeDefined()
    })

    it('with incorrect data and throw validation error', async () => {
      const userPayload = fakeServiceUserPayload(null, { isIncorrect: true })

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

  describe('Get one user by email', () => {
    let getOneByEmailSpy: jest.SpyInstance

    beforeEach(async () => {
      getOneByEmailSpy = jest.spyOn(userService, 'getOneByEmail')
    })

    it('which exists', async () => {
      const newUser = await userService.createOne(fakeServiceUserPayload())
      const user = await userService.getOneByEmail(newUser.email)

      expect(getOneByEmailSpy).toBeCalledTimes(1)
      expect(getOneByEmailSpy).toBeCalledWith(newUser.email)
      expect(user).toBeDefined()
    })

    it('which not exist and throw not found error', async () => {
      const fakeEmail = internet.email()

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

  describe('Delete one user by id', () => {
    let deleteOneByIdSpy: jest.SpyInstance

    beforeEach(async () => {
      deleteOneByIdSpy = jest.spyOn(userService, 'deleteOneById')
    })

    it('which exists', async () => {
      const newUser = await userService.createOne(fakeServiceUserPayload())
      const deletedUser = await userService.deleteOneById(newUser.id)

      expect(deleteOneByIdSpy).toBeCalledTimes(1)
      expect(deleteOneByIdSpy).toBeCalledWith(newUser.id)
      expect(deletedUser).toBeDefined()
    })

    it('which not exist and throw not found error', async () => {
      const fakeId = generateEntityId()

      try {
        const deletedUser = await userService.deleteOneById(fakeId)
        expect(deletedUser).not.toBeDefined()
      } catch (error) {
        expect(deleteOneByIdSpy).toBeCalledTimes(1)
        expect(deleteOneByIdSpy).toBeCalledWith(fakeId)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })
  })
})
