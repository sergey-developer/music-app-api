import { lorem } from 'faker'
import { container as DiContainer } from 'tsyringe'

import { fakeRepoRequestPayload } from '__tests__/fakeData/request'
import { fakeEntityId } from '__tests__/utils'
import throwError from 'app/utils/errors/throwError'
import { EntityNamesEnum } from 'database/constants'
import {
  DatabaseNotFoundError,
  DatabaseUnknownError,
  DatabaseValidationError,
} from 'database/errors'
import { RequestModel } from 'database/models/request'
import * as db from 'database/utils/db'
import { registerModel } from 'database/utils/registerModels'
import { DiTokenEnum } from 'lib/dependency-injection'
import { RequestStatusEnum } from 'modules/request/constants'
import {
  IDeleteManyRequestFilter,
  IDeleteOneRequestFilter,
  IFindAllRequestsFilter,
  IFindOneRequestFilter,
  IUpdateOneRequestFilter,
  IUpdateOneRequestPayload,
  RequestRepository,
} from 'modules/request/repository'

let requestRepository: RequestRepository

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  registerModel(DiTokenEnum.Request)
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

describe('Request repository', () => {
  describe('Create one request', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(requestRepository, 'createOne')
    })

    it('with correct data request created successfully', async () => {
      const creationPayload = fakeRepoRequestPayload()
      const newRequest = await requestRepository.createOne(creationPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(creationPayload)
      expect(newRequest.id).toBeTruthy()
      expect(newRequest.status).toBe(RequestStatusEnum.Pending)
      expect(newRequest.reason).toBeNull()
      expect(newRequest.entityName).toBe(creationPayload.entityName)
      expect(newRequest.populated('creator').toString()).toBe(
        creationPayload.creator,
      )
      expect(newRequest.populated('entity').toString()).toBe(
        creationPayload.entity,
      )
    })

    it('with incorrect data throw validation error', async () => {
      const creationPayload = fakeRepoRequestPayload(null, {
        isIncorrect: true,
      })

      try {
        const newRequest = await requestRepository.createOne(creationPayload)
        expect(newRequest).not.toBeTruthy()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(creationPayload)
        expect(error).toBeInstanceOf(DatabaseValidationError)
      }
    })

    it('request of artist created successfully', async () => {
      const creationPayload = fakeRepoRequestPayload({
        entityName: EntityNamesEnum.Artist,
      })
      const newRequest = await requestRepository.createOne(creationPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(creationPayload)
      expect(newRequest.entityName).toBe(EntityNamesEnum.Artist)
    })

    it('request of album created successfully', async () => {
      const creationPayload = fakeRepoRequestPayload({
        entityName: EntityNamesEnum.Album,
      })
      const newRequest = await requestRepository.createOne(creationPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(creationPayload)
      expect(newRequest.entityName).toBe(EntityNamesEnum.Album)
    })

    it('request of track created successfully', async () => {
      const creationPayload = fakeRepoRequestPayload({
        entityName: EntityNamesEnum.Track,
      })
      const newRequest = await requestRepository.createOne(creationPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(creationPayload)
      expect(newRequest.entityName).toBe(EntityNamesEnum.Track)
    })

    it('throw unknown error', async () => {
      const modelSaveSpy = jest
        .spyOn(RequestModel.prototype, 'save')
        .mockImplementationOnce(() => throwError())

      try {
        const request = await requestRepository.createOne(
          fakeRepoRequestPayload(),
        )

        expect(request).not.toBeTruthy()
      } catch (error: any) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(modelSaveSpy).toBeCalledTimes(1)
        expect(error).toBeInstanceOf(DatabaseUnknownError)
      }
    })
  })

  describe('Update one request', () => {
    let updateOneSpy: jest.SpyInstance

    beforeEach(() => {
      updateOneSpy = jest.spyOn(requestRepository, 'updateOne')
    })

    it('by id with correct data updated successfully', async () => {
      const creationPayload = fakeRepoRequestPayload()
      const newRequest = await requestRepository.createOne(creationPayload)

      const filter: IUpdateOneRequestFilter = { id: newRequest.id }
      const updates: IUpdateOneRequestPayload = {
        status: RequestStatusEnum.Approved,
        reason: lorem.words(5),
      }

      const updatedRequest = await requestRepository.updateOne(filter, updates)

      expect(updateOneSpy).toBeCalledTimes(1)
      expect(updateOneSpy).toBeCalledWith(filter, updates)
      expect(updatedRequest.id).toBe(newRequest.id)
      expect(updatedRequest.reason).not.toBe(newRequest.reason)
      expect(updatedRequest.status).not.toBe(newRequest.status)
      expect(updatedRequest.entityName).toBe(newRequest.entityName)
      expect(updatedRequest.populated('entity').toString()).toBe(
        newRequest.populated('entity').toString(),
      )
      expect(updatedRequest.creator).toBe(newRequest.creator)
    })

    it('by id with incorrect data throw validation error', async () => {
      const creationPayload = fakeRepoRequestPayload()
      const newRequest = await requestRepository.createOne(creationPayload)

      const filter: IUpdateOneRequestFilter = { id: newRequest.id }
      const updates: IUpdateOneRequestPayload = {
        status: RequestStatusEnum.Approved,
        reason: lorem.word(2),
      }

      try {
        const updatedRequest = await requestRepository.updateOne(
          filter,
          updates,
        )

        expect(updatedRequest).not.toBeTruthy()
      } catch (error) {
        expect(updateOneSpy).toBeCalledTimes(1)
        expect(updateOneSpy).toBeCalledWith(filter, updates)
        expect(error).toBeInstanceOf(DatabaseValidationError)
      }
    })

    it('by id which does not exist throw not found error', async () => {
      const filter: IUpdateOneRequestFilter = { id: fakeEntityId() }
      const updates: IUpdateOneRequestPayload = {
        status: RequestStatusEnum.Rejected,
      }

      try {
        const updatedRequest = await requestRepository.updateOne(
          filter,
          updates,
        )

        expect(updatedRequest).not.toBeTruthy()
      } catch (error) {
        expect(updateOneSpy).toBeCalledTimes(1)
        expect(updateOneSpy).toBeCalledWith(filter, updates)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })

    it('by entity with correct data updated successfully', async () => {
      const creationPayload = fakeRepoRequestPayload()
      const newRequest = await requestRepository.createOne(creationPayload)

      const filter: IUpdateOneRequestFilter = { entity: creationPayload.entity }
      const updates: IUpdateOneRequestPayload = {
        status: RequestStatusEnum.Approved,
        reason: lorem.words(5),
      }

      const updatedRequest = await requestRepository.updateOne(filter, updates)

      expect(updateOneSpy).toBeCalledTimes(1)
      expect(updateOneSpy).toBeCalledWith(filter, updates)
      expect(updatedRequest.id).toBe(newRequest.id)
      expect(updatedRequest.reason).not.toBe(newRequest.reason)
      expect(updatedRequest.status).not.toBe(newRequest.status)
      expect(updatedRequest.entityName).toBe(newRequest.entityName)
      expect(updatedRequest.populated('entity').toString()).toBe(
        newRequest.populated('entity').toString(),
      )
      expect(updatedRequest.populated('creator').toString()).toBe(
        newRequest.populated('creator').toString(),
      )
    })

    it('by entity with incorrect data throw validation error', async () => {
      const creationPayload = fakeRepoRequestPayload()
      await requestRepository.createOne(creationPayload)

      const filter: IUpdateOneRequestFilter = { entity: creationPayload.entity }
      const updates: IUpdateOneRequestPayload = {
        status: RequestStatusEnum.Approved,
        reason: lorem.word(2),
      }

      try {
        const updatedRequest = await requestRepository.updateOne(
          filter,
          updates,
        )

        expect(updatedRequest).not.toBeTruthy()
      } catch (error) {
        expect(updateOneSpy).toBeCalledTimes(1)
        expect(updateOneSpy).toBeCalledWith(filter, updates)
        expect(error).toBeInstanceOf(DatabaseValidationError)
      }
    })

    it('by entity which does not exist throw not found error', async () => {
      const filter: IUpdateOneRequestFilter = { entity: fakeEntityId() }
      const updates: IUpdateOneRequestPayload = {
        status: RequestStatusEnum.Rejected,
      }

      try {
        const updatedRequest = await requestRepository.updateOne(
          filter,
          updates,
        )

        expect(updatedRequest).not.toBeTruthy()
      } catch (error) {
        expect(updateOneSpy).toBeCalledTimes(1)
        expect(updateOneSpy).toBeCalledWith(filter, updates)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })

    it(`update request status to "${RequestStatusEnum.Rejected}"`, async () => {
      const creationPayload = fakeRepoRequestPayload()
      const newRequest = await requestRepository.createOne(creationPayload)

      const filter: IUpdateOneRequestFilter = { id: newRequest.id }
      const updates: IUpdateOneRequestPayload = {
        status: RequestStatusEnum.Rejected,
        reason: lorem.words(5),
      }
      const updatedRequest = await requestRepository.updateOne(filter, updates)

      expect(updatedRequest.status).toBe(RequestStatusEnum.Rejected)
      expect(updatedRequest.reason).toBe(updates.reason)
    })

    it(`update request status to "${RequestStatusEnum.Approved}"`, async () => {
      const creationPayload = fakeRepoRequestPayload()
      const newRequest = await requestRepository.createOne(creationPayload)

      const filter: IUpdateOneRequestFilter = { id: newRequest.id }
      const updates: IUpdateOneRequestPayload = {
        status: RequestStatusEnum.Approved,
      }
      const updatedRequest = await requestRepository.updateOne(filter, updates)

      expect(updatedRequest.status).toBe(RequestStatusEnum.Approved)
    })

    it(`update request status to "${RequestStatusEnum.Pending}"`, async () => {
      const creationPayload = fakeRepoRequestPayload()
      const newRequest = await requestRepository.createOne(creationPayload)

      const filter: IUpdateOneRequestFilter = { id: newRequest.id }
      const updates: IUpdateOneRequestPayload = {
        status: RequestStatusEnum.Pending,
      }
      const updatedRequest = await requestRepository.updateOne(filter, updates)

      expect(updatedRequest.status).toBe(RequestStatusEnum.Pending)
    })

    it('throw unknown error', async () => {
      const modelFindOneAndUpdateSpy = jest
        .spyOn(RequestModel, 'findOneAndUpdate')
        .mockImplementationOnce(() => throwError())

      try {
        const request = await requestRepository.updateOne(
          {},
          { status: RequestStatusEnum.Approved },
        )

        expect(request).not.toBeTruthy()
      } catch (error: any) {
        expect(updateOneSpy).toBeCalledTimes(1)
        expect(modelFindOneAndUpdateSpy).toBeCalledTimes(1)
        expect(error).toBeInstanceOf(DatabaseUnknownError)
      }
    })
  })

  describe('Find all requests', () => {
    let findAllWhereSpy: jest.SpyInstance

    beforeEach(() => {
      findAllWhereSpy = jest.spyOn(requestRepository, 'findAllWhere')
    })

    it('with empty filter', async () => {
      const creationPayload1 = fakeRepoRequestPayload()
      const creationPayload2 = fakeRepoRequestPayload()

      await requestRepository.createOne(creationPayload1)
      await requestRepository.createOne(creationPayload2)

      const filter = {}
      const requests = await requestRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(requests)).toBe(true)
      expect(requests).toHaveLength(2)
    })

    it('with filter throw unknown error', async () => {
      const modelFindSpy = jest
        .spyOn(RequestModel, 'find')
        .mockImplementationOnce(() => throwError())

      try {
        const requests = await requestRepository.findAllWhere({})
        expect(requests).not.toBeTruthy()
      } catch (error: any) {
        expect(findAllWhereSpy).toBeCalledTimes(1)
        expect(modelFindSpy).toBeCalledTimes(1)
        expect(error).toBeInstanceOf(DatabaseUnknownError)
      }
    })

    it('without filter', async () => {
      const findAllSpy = jest.spyOn(requestRepository, 'findAll')

      const creationPayload1 = fakeRepoRequestPayload()
      const creationPayload2 = fakeRepoRequestPayload()

      await requestRepository.createOne(creationPayload1)
      await requestRepository.createOne(creationPayload2)

      const requests = await requestRepository.findAll()

      expect(findAllSpy).toBeCalledTimes(1)
      expect(Array.isArray(requests)).toBe(true)
      expect(requests).toHaveLength(2)
    })

    it('without filter throw unknown error', async () => {
      const findAllSpy = jest.spyOn(requestRepository, 'findAll')
      const modelFindSpy = jest
        .spyOn(RequestModel, 'find')
        .mockClear()
        .mockImplementationOnce(() => throwError())

      try {
        const request = await requestRepository.findAll()
        expect(request).not.toBeTruthy()
      } catch (error: any) {
        expect(findAllSpy).toBeCalledTimes(1)
        expect(modelFindSpy).toBeCalledTimes(1)
        expect(error).toBeInstanceOf(DatabaseUnknownError)
      }
    })

    it('by entity ids which exist', async () => {
      const creationPayload1 = fakeRepoRequestPayload()
      const creationPayload2 = fakeRepoRequestPayload()

      await requestRepository.createOne(creationPayload1)
      await requestRepository.createOne(creationPayload2)

      const filter: IFindAllRequestsFilter = {
        entityIds: [creationPayload1.entity],
      }
      const requests = await requestRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(requests)).toBe(true)
      expect(requests).toHaveLength(1)
    })

    it('by entity ids which do not exist', async () => {
      const creationPayload = fakeRepoRequestPayload()
      await requestRepository.createOne(creationPayload)

      const filter: IFindAllRequestsFilter = { entityIds: [fakeEntityId()] }
      const requests = await requestRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(requests)).toBe(true)
      expect(requests).toHaveLength(0)
    })

    it(`by "${RequestStatusEnum.Pending}" status`, async () => {
      const creationPayload1 = fakeRepoRequestPayload()
      const creationPayload2 = fakeRepoRequestPayload()

      const newRequest1 = await requestRepository.createOne(creationPayload1)
      await requestRepository.createOne(creationPayload2)

      await requestRepository.updateOne(
        { id: newRequest1.id },
        { status: RequestStatusEnum.Approved },
      )

      const filter: IFindAllRequestsFilter = {
        status: RequestStatusEnum.Pending,
      }
      const requests = await requestRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(requests)).toBe(true)
      expect(requests).toHaveLength(1)
    })

    it(`by "${RequestStatusEnum.Approved}" status`, async () => {
      const creationPayload1 = fakeRepoRequestPayload()
      const creationPayload2 = fakeRepoRequestPayload()

      const newRequest1 = await requestRepository.createOne(creationPayload1)
      await requestRepository.createOne(creationPayload2)

      await requestRepository.updateOne(
        { id: newRequest1.id },
        { status: RequestStatusEnum.Approved },
      )

      const filter: IFindAllRequestsFilter = {
        status: RequestStatusEnum.Approved,
      }
      const requests = await requestRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(requests)).toBe(true)
      expect(requests).toHaveLength(1)
    })

    it(`by "${RequestStatusEnum.Rejected}" status`, async () => {
      const creationPayload1 = fakeRepoRequestPayload()
      const creationPayload2 = fakeRepoRequestPayload()

      const newRequest1 = await requestRepository.createOne(creationPayload1)
      await requestRepository.createOne(creationPayload2)

      await requestRepository.updateOne(
        { id: newRequest1.id },
        { status: RequestStatusEnum.Rejected },
      )

      const filter: IFindAllRequestsFilter = {
        status: RequestStatusEnum.Rejected,
      }
      const requests = await requestRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(requests)).toBe(true)
      expect(requests).toHaveLength(1)
    })

    it('by creator which exists', async () => {
      const creationPayload1 = fakeRepoRequestPayload()
      const creationPayload2 = fakeRepoRequestPayload()

      await requestRepository.createOne(creationPayload1)
      await requestRepository.createOne(creationPayload2)

      const filter: IFindAllRequestsFilter = {
        creator: creationPayload1.creator,
      }
      const requests = await requestRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(requests)).toBe(true)
      expect(requests).toHaveLength(1)
    })

    it('by creator which does not exist', async () => {
      const creationPayload = fakeRepoRequestPayload()
      await requestRepository.createOne(creationPayload)

      const filter: IFindAllRequestsFilter = {
        creator: fakeEntityId(),
      }
      const requests = await requestRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(requests)).toBe(true)
      expect(requests).toHaveLength(0)
    })

    it('of artists', async () => {
      const creationPayload1 = fakeRepoRequestPayload({
        entityName: EntityNamesEnum.Artist,
      })
      const creationPayload2 = fakeRepoRequestPayload({
        entityName: EntityNamesEnum.Album,
      })

      await requestRepository.createOne(creationPayload1)
      await requestRepository.createOne(creationPayload2)

      const filter: IFindAllRequestsFilter = {
        kind: EntityNamesEnum.Artist,
      }
      const requests = await requestRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(requests)).toBe(true)
      expect(requests).toHaveLength(1)
    })

    it('of albums', async () => {
      const creationPayload1 = fakeRepoRequestPayload({
        entityName: EntityNamesEnum.Artist,
      })
      const creationPayload2 = fakeRepoRequestPayload({
        entityName: EntityNamesEnum.Album,
      })

      await requestRepository.createOne(creationPayload1)
      await requestRepository.createOne(creationPayload2)

      const filter: IFindAllRequestsFilter = {
        kind: EntityNamesEnum.Album,
      }
      const requests = await requestRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(requests)).toBe(true)
      expect(requests).toHaveLength(1)
    })

    it('of tracks', async () => {
      const creationPayload1 = fakeRepoRequestPayload({
        entityName: EntityNamesEnum.Album,
      })
      const creationPayload2 = fakeRepoRequestPayload({
        entityName: EntityNamesEnum.Track,
      })

      await requestRepository.createOne(creationPayload1)
      await requestRepository.createOne(creationPayload2)

      const filter: IFindAllRequestsFilter = {
        kind: EntityNamesEnum.Track,
      }
      const requests = await requestRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(requests)).toBe(true)
      expect(requests).toHaveLength(1)
    })
  })

  describe('Find one request', () => {
    let findOneSpy: jest.SpyInstance

    beforeEach(() => {
      findOneSpy = jest.spyOn(requestRepository, 'findOne')
    })

    it('by id which exists', async () => {
      const creationPayload = fakeRepoRequestPayload()
      const newRequest = await requestRepository.createOne(creationPayload)

      const filter: IFindOneRequestFilter = { id: newRequest.id }
      const request = await requestRepository.findOne(filter)

      expect(findOneSpy).toBeCalledTimes(1)
      expect(findOneSpy).toBeCalledWith(filter)
      expect(request.id).toBe(newRequest.id)
      expect(request.reason).toBe(newRequest.reason)
      expect(request.status).toBe(newRequest.status)
      expect(request.populated('creator').toString()).toBe(
        newRequest.populated('creator').toString(),
      )
      expect(request.populated('entity').toString()).toBe(
        newRequest.populated('entity').toString(),
      )
      expect(request.entityName).toBe(newRequest.entityName)
    })

    it('by id which does not exist throw not found error', async () => {
      const filter: IFindOneRequestFilter = { id: fakeEntityId() }

      try {
        const request = await requestRepository.findOne(filter)
        expect(request).not.toBeTruthy()
      } catch (error) {
        expect(findOneSpy).toBeCalledTimes(1)
        expect(findOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })

    it('by entity which exists', async () => {
      const creationPayload = fakeRepoRequestPayload()
      const newRequest = await requestRepository.createOne(creationPayload)

      const filter: IFindOneRequestFilter = { entity: creationPayload.entity }
      const request = await requestRepository.findOne(filter)

      expect(findOneSpy).toBeCalledTimes(1)
      expect(findOneSpy).toBeCalledWith(filter)
      expect(request.id).toBe(newRequest.id)
      expect(request.reason).toBe(newRequest.reason)
      expect(request.status).toBe(newRequest.status)
      expect(request.populated('creator').toString()).toBe(
        newRequest.populated('creator').toString(),
      )
      expect(request.populated('entity').toString()).toBe(
        newRequest.populated('entity').toString(),
      )
      expect(request.entityName).toBe(newRequest.entityName)
    })

    it('by entity which does not exist throw not found error', async () => {
      const filter: IFindOneRequestFilter = { entity: fakeEntityId() }

      try {
        const request = await requestRepository.findOne(filter)
        expect(request).not.toBeTruthy()
      } catch (error) {
        expect(findOneSpy).toBeCalledTimes(1)
        expect(findOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })

    it('throw unknown error', async () => {
      const modelFindOneSpy = jest
        .spyOn(RequestModel, 'findOne')
        .mockImplementationOnce(() => throwError())

      try {
        const request = await requestRepository.findOne({})
        expect(request).not.toBeTruthy()
      } catch (error: any) {
        expect(findOneSpy).toBeCalledTimes(1)
        expect(modelFindOneSpy).toBeCalledTimes(1)
        expect(error).toBeInstanceOf(DatabaseUnknownError)
      }
    })
  })

  describe('Delete one request', () => {
    let deleteOneSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneSpy = jest.spyOn(requestRepository, 'deleteOne')
    })

    it('by id which exists', async () => {
      const creationPayload = fakeRepoRequestPayload()
      const newRequest = await requestRepository.createOne(creationPayload)

      const filter: IDeleteOneRequestFilter = { id: newRequest.id }
      const deletedRequest = await requestRepository.deleteOne(filter)

      expect(deleteOneSpy).toBeCalledTimes(1)
      expect(deleteOneSpy).toBeCalledWith(filter)
      expect(deletedRequest.id).toBe(newRequest.id)
      expect(deletedRequest.populated('entity').toString()).toBe(
        newRequest.populated('entity').toString(),
      )
      expect(deletedRequest.entityName).toBe(newRequest.entityName)
      expect(deletedRequest.creator.toString()).toBe(
        newRequest.populated('creator').toString(),
      )
      expect(deletedRequest.reason).toBe(newRequest.reason)
      expect(deletedRequest.status).toBe(newRequest.status)
    })

    it('by id which does not exist and throw not found error', async () => {
      const filter: IDeleteOneRequestFilter = { id: fakeEntityId() }

      try {
        const deletedRequest = await requestRepository.deleteOne(filter)
        expect(deletedRequest).not.toBeTruthy()
      } catch (error) {
        expect(deleteOneSpy).toBeCalledTimes(1)
        expect(deleteOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })

    it('by entity which exists', async () => {
      const creationPayload = fakeRepoRequestPayload()
      const newRequest = await requestRepository.createOne(creationPayload)

      const filter: IDeleteOneRequestFilter = { entity: creationPayload.entity }
      const deletedRequest = await requestRepository.deleteOne(filter)

      expect(deleteOneSpy).toBeCalledTimes(1)
      expect(deleteOneSpy).toBeCalledWith(filter)
      expect(deletedRequest.id).toBe(newRequest.id)
      expect(deletedRequest.populated('entity').toString()).toBe(
        newRequest.populated('entity').toString(),
      )
      expect(deletedRequest.entityName).toBe(newRequest.entityName)
      expect(deletedRequest.creator.toString()).toBe(
        newRequest.populated('creator').toString(),
      )
      expect(deletedRequest.reason).toBe(newRequest.reason)
      expect(deletedRequest.status).toBe(newRequest.status)
    })

    it('by entity which does not exist and throw not found error', async () => {
      const filter: IDeleteOneRequestFilter = { entity: fakeEntityId() }

      try {
        const deletedRequest = await requestRepository.deleteOne(filter)
        expect(deletedRequest).not.toBeTruthy()
      } catch (error) {
        expect(deleteOneSpy).toBeCalledTimes(1)
        expect(deleteOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })

    it('throw unknown error', async () => {
      const modelFindOneAndDeleteSpy = jest
        .spyOn(RequestModel, 'findOneAndDelete')
        .mockImplementationOnce(() => throwError())

      try {
        const request = await requestRepository.deleteOne({})
        expect(request).not.toBeTruthy()
      } catch (error: any) {
        expect(deleteOneSpy).toBeCalledTimes(1)
        expect(modelFindOneAndDeleteSpy).toBeCalledTimes(1)
        expect(error).toBeInstanceOf(DatabaseUnknownError)
      }
    })
  })

  describe('Delete many requests', () => {
    let deleteManySpy: jest.SpyInstance

    beforeEach(() => {
      deleteManySpy = jest.spyOn(requestRepository, 'deleteMany')
    })

    it('by entity ids which exist', async () => {
      const creationPayload1 = fakeRepoRequestPayload()
      const creationPayload2 = fakeRepoRequestPayload()

      await requestRepository.createOne(creationPayload1)
      await requestRepository.createOne(creationPayload2)

      const filter: IDeleteManyRequestFilter = {
        entityIds: [creationPayload1.entity],
      }

      const deletionResult = await requestRepository.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(1)
    })

    it('by entity ids which do not exist', async () => {
      const creationPayload = fakeRepoRequestPayload()
      await requestRepository.createOne(creationPayload)

      const filter: IDeleteManyRequestFilter = {
        entityIds: [fakeEntityId()],
      }

      const deletionResult = await requestRepository.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(0)
    })

    it('throw unknown error', async () => {
      const modelDeleteManySpy = jest
        .spyOn(RequestModel, 'deleteMany')
        .mockImplementationOnce(() => throwError())

      try {
        const deletionResult = await requestRepository.deleteMany({})
        expect(deletionResult).not.toBeTruthy()
      } catch (error: any) {
        expect(deleteManySpy).toBeCalledTimes(1)
        expect(modelDeleteManySpy).toBeCalledTimes(1)
        expect(error).toBeInstanceOf(DatabaseUnknownError)
      }
    })
  })
})
