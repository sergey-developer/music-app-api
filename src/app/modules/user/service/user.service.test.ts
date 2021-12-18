import { internet } from 'faker'
import { container as DiContainer } from 'tsyringe'

import { fakeServiceUserPayload } from '__tests__/fakeData/user'
import { fakeEntityId } from '__tests__/fakeData/utils'
import {
  AppNotFoundError,
  AppValidationError,
} from 'app/utils/errors/appErrors'
import * as db from 'database/utils/db'
import { registerModel } from 'database/utils/registerModels'
import { DiTokenEnum } from 'lib/dependency-injection'
import { UserService } from 'modules/user/service'

let userService: UserService

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  registerModel(DiTokenEnum.User)
  userService = DiContainer.resolve(UserService)
})

afterEach(async () => {
  DiContainer.clearInstances()
  await db.clear()
})

afterAll(async () => {
  await db.drop()
  await db.disconnect()
})

describe('User service', () => {
  describe('Create one user', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(async () => {
      createOneSpy = jest.spyOn(userService, 'createOne')
    })

    it('with correct data created successfully', async () => {
      const creationPayload = fakeServiceUserPayload()
      const newUser = await userService.createOne(creationPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(creationPayload)
      expect(newUser).toBeTruthy()
    })

    it('with incorrect data throw validation error', async () => {
      const creationPayload = fakeServiceUserPayload(null, {
        isIncorrect: true,
      })

      try {
        const newUser = await userService.createOne(creationPayload)
        expect(newUser).not.toBeTruthy()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(creationPayload)
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
      expect(user).toBeTruthy()
    })

    it('which not exist and throw not found error', async () => {
      const fakeEmail = internet.email()

      try {
        const user = await userService.getOneByEmail(fakeEmail)
        expect(user).not.toBeTruthy()
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
      expect(deletedUser).toBeTruthy()
    })

    it('which not exist and throw not found error', async () => {
      const fakeId = fakeEntityId()

      try {
        const deletedUser = await userService.deleteOneById(fakeId)
        expect(deletedUser).not.toBeTruthy()
      } catch (error) {
        expect(deleteOneByIdSpy).toBeCalledTimes(1)
        expect(deleteOneByIdSpy).toBeCalledWith(fakeId)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })
  })
})
