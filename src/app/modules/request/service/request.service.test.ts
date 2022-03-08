import { lorem } from 'faker'
import { container as DiContainer } from 'tsyringe'

import { fakeServiceRequestPayload } from '__tests__/fakeData/request'
import { fakeEntityId } from '__tests__/utils'
import { EMPTY_FILTER_ERR_MSG } from 'app/constants/messages/errors'
import {
  AppNotFoundError,
  AppUnknownError,
  AppValidationError,
} from 'app/utils/errors/appErrors'
import throwError from 'app/utils/errors/throwError'
import { EntityNamesEnum } from 'database/constants'
import * as db from 'database/utils/db'
import { registerModel } from 'database/utils/registerModels'
import { DiTokenEnum } from 'lib/dependency-injection'
import { RequestStatusEnum } from 'modules/request/constants'
import { RequestRepository } from 'modules/request/repository'
import {
  IDeleteManyRequestFilter,
  IDeleteOneRequestFilter,
  IDeleteOneRequestWithEntityFilter,
  IGetAllRequestsFilter,
  IUpdateOneRequestFilter,
  IUpdateOneRequestPayload,
  RequestService,
} from 'modules/request/service'

let requestService: RequestService
let requestRepository: RequestRepository

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  registerModel(DiTokenEnum.Request)
  requestService = DiContainer.resolve(RequestService)
  requestRepository = DiContainer.resolve(RequestRepository)
})

afterEach(async () => {
  DiContainer.clearInstances()
  await db.clear()
})

afterAll(async () => {
  await db.drop()
  await db.disconnect()
})

describe('Request service', () => {
  describe('Create one request', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(requestService, 'createOne')
    })

    it('with correct data request created successfully', async () => {
      const creationPayload = fakeServiceRequestPayload()
      const newRequest = await requestService.createOne(creationPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(creationPayload)
      expect(newRequest).toBeTruthy()
    })

    it('with incorrect data throw validation error', async () => {
      const creationPayload = fakeServiceRequestPayload(null, {
        isIncorrect: true,
      })

      try {
        const newRequest = await requestService.createOne(creationPayload)
        expect(newRequest).not.toBeTruthy()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(creationPayload)
        expect(error).toBeInstanceOf(AppValidationError)
      }
    })

    it('throw unknown error', async () => {
      const requestRepoCreateOneSpy = jest
        .spyOn(requestRepository, 'createOne')
        .mockImplementationOnce(() => throwError())

      const creationPayload = fakeServiceRequestPayload()

      try {
        const newRequest = await requestService.createOne(creationPayload)
        expect(newRequest).not.toBeTruthy()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(requestRepoCreateOneSpy).toBeCalledTimes(1)
        expect(error).toBeInstanceOf(AppUnknownError)
      }
    })
  })

  describe('Update one request', () => {
    let updateOneSpy: jest.SpyInstance

    beforeEach(() => {
      updateOneSpy = jest.spyOn(requestService, 'updateOne')
    })

    it('by id with correct data updated successfully', async () => {
      const creationPayload = fakeServiceRequestPayload()
      const newRequest = await requestService.createOne(creationPayload)

      const filter: IUpdateOneRequestFilter = { id: newRequest.id }
      const updates: IUpdateOneRequestPayload = {
        status: RequestStatusEnum.Approved,
        reason: lorem.words(5),
      }

      const updatedRequest = await requestService.updateOne(filter, updates)

      expect(updateOneSpy).toBeCalledTimes(1)
      expect(updateOneSpy).toBeCalledWith(filter, updates)
      expect(updatedRequest).toBeTruthy()
    })

    it('by id with incorrect data throw validation error', async () => {
      const creationPayload = fakeServiceRequestPayload()
      const newRequest = await requestService.createOne(creationPayload)

      const filter: IUpdateOneRequestFilter = { id: newRequest.id }
      const updates: IUpdateOneRequestPayload = {
        status: RequestStatusEnum.Approved,
        reason: lorem.word(2),
      }

      try {
        const updatedRequest = await requestService.updateOne(filter, updates)

        expect(updatedRequest).not.toBeTruthy()
      } catch (error) {
        expect(updateOneSpy).toBeCalledTimes(1)
        expect(updateOneSpy).toBeCalledWith(filter, updates)
        expect(error).toBeInstanceOf(AppValidationError)
      }
    })

    it('by id which does not exist throw not found error', async () => {
      const filter: IUpdateOneRequestFilter = { id: fakeEntityId() }
      const updates: IUpdateOneRequestPayload = {
        status: RequestStatusEnum.Rejected,
      }

      try {
        const updatedRequest = await requestService.updateOne(filter, updates)

        expect(updatedRequest).not.toBeTruthy()
      } catch (error) {
        expect(updateOneSpy).toBeCalledTimes(1)
        expect(updateOneSpy).toBeCalledWith(filter, updates)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })

    it('throw unknown error', async () => {
      const requestRepoUpdateOneSpy = jest
        .spyOn(requestRepository, 'updateOne')
        .mockImplementationOnce(() => throwError())

      try {
        const request = await requestService.updateOne(
          {},
          { status: RequestStatusEnum.Approved },
        )

        expect(request).not.toBeTruthy()
      } catch (error: any) {
        expect(updateOneSpy).toBeCalledTimes(1)
        expect(requestRepoUpdateOneSpy).toBeCalledTimes(1)
        expect(error).toBeInstanceOf(AppUnknownError)
      }
    })
  })

  describe('Get all requests', () => {
    let getAllSpy: jest.SpyInstance

    beforeEach(() => {
      getAllSpy = jest.spyOn(requestService, 'getAll')
    })

    it('with empty filter', async () => {
      const creationPayload1 = fakeServiceRequestPayload()
      const creationPayload2 = fakeServiceRequestPayload()

      await requestService.createOne(creationPayload1)
      await requestService.createOne(creationPayload2)

      const filter = {}
      const requests = await requestService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(requests).toHaveLength(2)
    })

    it('with filter throw unknown error', async () => {
      const requestRepoFindAllSpy = jest
        .spyOn(requestRepository, 'findAll')
        .mockImplementationOnce(() => throwError())

      try {
        const requests = await requestService.getAll({})
        expect(requests).not.toBeTruthy()
      } catch (error: any) {
        expect(getAllSpy).toBeCalledTimes(1)
        expect(requestRepoFindAllSpy).toBeCalledTimes(1)
        expect(error).toBeInstanceOf(AppUnknownError)
      }
    })

    it(`by "${RequestStatusEnum.Pending}" status`, async () => {
      const creationPayload1 = fakeServiceRequestPayload()
      const creationPayload2 = fakeServiceRequestPayload()

      const newRequest1 = await requestService.createOne(creationPayload1)
      await requestService.createOne(creationPayload2)

      await requestService.updateOne(
        { id: newRequest1.id },
        { status: RequestStatusEnum.Approved },
      )

      const filter: IGetAllRequestsFilter = {
        status: RequestStatusEnum.Pending,
      }
      const requests = await requestService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(requests).toHaveLength(1)
    })

    it(`by "${RequestStatusEnum.Approved}" status`, async () => {
      const creationPayload1 = fakeServiceRequestPayload()
      const creationPayload2 = fakeServiceRequestPayload()

      const newRequest1 = await requestService.createOne(creationPayload1)
      await requestService.createOne(creationPayload2)

      await requestService.updateOne(
        { id: newRequest1.id },
        { status: RequestStatusEnum.Approved },
      )

      const filter: IGetAllRequestsFilter = {
        status: RequestStatusEnum.Approved,
      }
      const requests = await requestService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(requests).toHaveLength(1)
    })

    it(`by "${RequestStatusEnum.Rejected}" status`, async () => {
      const creationPayload1 = fakeServiceRequestPayload()
      const creationPayload2 = fakeServiceRequestPayload()

      const newRequest1 = await requestService.createOne(creationPayload1)
      await requestService.createOne(creationPayload2)

      await requestService.updateOne(
        { id: newRequest1.id },
        { status: RequestStatusEnum.Rejected },
      )

      const filter: IGetAllRequestsFilter = {
        status: RequestStatusEnum.Rejected,
      }
      const requests = await requestService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(requests).toHaveLength(1)
    })

    it('by creator which exists', async () => {
      const creationPayload1 = fakeServiceRequestPayload()
      const creationPayload2 = fakeServiceRequestPayload()

      await requestService.createOne(creationPayload1)
      await requestService.createOne(creationPayload2)

      const filter: IGetAllRequestsFilter = {
        creator: creationPayload1.creator,
      }
      const requests = await requestService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(requests).toHaveLength(1)
    })

    it('by creator which does not exist', async () => {
      const creationPayload = fakeServiceRequestPayload()
      await requestService.createOne(creationPayload)

      const filter: IGetAllRequestsFilter = {
        creator: fakeEntityId(),
      }
      const requests = await requestService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(requests).toHaveLength(0)
    })

    it('of artists', async () => {
      const creationPayload1 = fakeServiceRequestPayload({
        entityName: EntityNamesEnum.Artist,
      })
      const creationPayload2 = fakeServiceRequestPayload({
        entityName: EntityNamesEnum.Album,
      })

      await requestService.createOne(creationPayload1)
      await requestService.createOne(creationPayload2)

      const filter: IGetAllRequestsFilter = {
        kind: EntityNamesEnum.Artist,
      }
      const requests = await requestService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(requests).toHaveLength(1)
    })

    it('of albums', async () => {
      const creationPayload1 = fakeServiceRequestPayload({
        entityName: EntityNamesEnum.Artist,
      })
      const creationPayload2 = fakeServiceRequestPayload({
        entityName: EntityNamesEnum.Album,
      })

      await requestService.createOne(creationPayload1)
      await requestService.createOne(creationPayload2)

      const filter: IGetAllRequestsFilter = {
        kind: EntityNamesEnum.Album,
      }
      const requests = await requestService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(requests).toHaveLength(1)
    })

    it('of tracks', async () => {
      const creationPayload1 = fakeServiceRequestPayload({
        entityName: EntityNamesEnum.Album,
      })
      const creationPayload2 = fakeServiceRequestPayload({
        entityName: EntityNamesEnum.Track,
      })

      await requestService.createOne(creationPayload1)
      await requestService.createOne(creationPayload2)

      const filter: IGetAllRequestsFilter = {
        kind: EntityNamesEnum.Track,
      }
      const requests = await requestService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(requests).toHaveLength(1)
    })
  })

  describe('Delete one request', () => {
    let deleteOneSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneSpy = jest.spyOn(requestService, 'deleteOne')
    })

    it('by id which exists', async () => {
      const creationPayload = fakeServiceRequestPayload()
      const newRequest = await requestService.createOne(creationPayload)

      const filter: IDeleteOneRequestFilter = { id: newRequest.id }
      const deletedRequest = await requestService.deleteOne(filter)

      expect(deleteOneSpy).toBeCalledTimes(1)
      expect(deleteOneSpy).toBeCalledWith(filter)
      expect(deletedRequest).toBeTruthy()
    })

    it('by id which does not exist and throw not found error', async () => {
      const filter: IDeleteOneRequestFilter = { id: fakeEntityId() }

      try {
        const deletedRequest = await requestService.deleteOne(filter)
        expect(deletedRequest).not.toBeTruthy()
      } catch (error) {
        expect(deleteOneSpy).toBeCalledTimes(1)
        expect(deleteOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })

    it('by entity which exists', async () => {
      const creationPayload = fakeServiceRequestPayload()
      await requestService.createOne(creationPayload)

      const filter: IDeleteOneRequestFilter = { entity: creationPayload.entity }
      const deletedRequest = await requestService.deleteOne(filter)

      expect(deleteOneSpy).toBeCalledTimes(1)
      expect(deleteOneSpy).toBeCalledWith(filter)
      expect(deletedRequest).toBeTruthy()
    })

    it('by entity which does not exist and throw not found error', async () => {
      const filter: IDeleteOneRequestFilter = { entity: fakeEntityId() }

      try {
        const deletedRequest = await requestService.deleteOne(filter)
        expect(deletedRequest).not.toBeTruthy()
      } catch (error) {
        expect(deleteOneSpy).toBeCalledTimes(1)
        expect(deleteOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })

    it('throw unknown error', async () => {
      const requestRepoDeleteOneSpy = jest
        .spyOn(requestRepository, 'deleteOne')
        .mockImplementationOnce(() => throwError())

      try {
        const request = await requestService.deleteOne({})
        expect(request).not.toBeTruthy()
      } catch (error: any) {
        expect(deleteOneSpy).toBeCalledTimes(1)
        expect(requestRepoDeleteOneSpy).toBeCalledTimes(1)
        expect(error).toBeInstanceOf(AppUnknownError)
      }
    })
  })

  describe('Delete one request with entity', () => {
    let deleteOneWithEntitySpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneWithEntitySpy = jest.spyOn(requestService, 'deleteOneWithEntity')
    })

    it('by id which exists', async () => {
      const creationPayload = fakeServiceRequestPayload()
      const newRequest = await requestService.createOne(creationPayload)

      const filter: IDeleteOneRequestWithEntityFilter = { id: newRequest.id }
      try {
        const request = await requestService.deleteOneWithEntity(filter)
        console.log({ request })
      } catch (error) {
        console.log('3: ', { error })
        expect(deleteOneWithEntitySpy).toBeCalledTimes(1)
        expect(deleteOneWithEntitySpy).toBeCalledWith(filter)
        // expect(request).toBeTruthy()
      }
    })
  })

  describe('Delete many requests', () => {
    let deleteManySpy: jest.SpyInstance

    beforeEach(() => {
      deleteManySpy = jest.spyOn(requestService, 'deleteMany')
    })

    it('by entity ids which exist', async () => {
      const creationPayload1 = fakeServiceRequestPayload()
      const creationPayload2 = fakeServiceRequestPayload()

      await requestService.createOne(creationPayload1)
      await requestService.createOne(creationPayload2)

      const filter: IDeleteManyRequestFilter = {
        entityIds: [creationPayload1.entity],
      }

      const deletionResult = await requestService.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(1)
    })

    it('by entity ids which do not exist', async () => {
      const creationPayload = fakeServiceRequestPayload()
      await requestService.createOne(creationPayload)

      const filter: IDeleteManyRequestFilter = {
        entityIds: [fakeEntityId()],
      }

      const deletionResult = await requestService.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(0)
    })

    it('with empty filter', async () => {
      const filter = {}

      try {
        const deletionResult = await requestService.deleteMany(filter)
        expect(deletionResult).not.toBeTruthy()
      } catch (error: any) {
        expect(deleteManySpy).toBeCalledTimes(1)
        expect(deleteManySpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(AppValidationError)
        expect(error.message).toBe(EMPTY_FILTER_ERR_MSG)
      }
    })

    it('throw unknown error', async () => {
      const requestRepoDeleteManySpy = jest
        .spyOn(requestRepository, 'deleteMany')
        .mockImplementationOnce(() => throwError())

      try {
        const deletionResult = await requestService.deleteMany({})
        expect(deletionResult).not.toBeTruthy()
      } catch (error: any) {
        expect(deleteManySpy).toBeCalledTimes(1)
        expect(requestRepoDeleteManySpy).toBeCalledTimes(1)
        expect(error).toBeInstanceOf(AppUnknownError)
      }
    })
  })
})
