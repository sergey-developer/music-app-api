import { container as DiContainer } from 'tsyringe'

import { fakeServiceTrackHistoryPayload } from '__tests__/fakeData/trackHistory'
import { fakeEntityId } from '__tests__/fakeData/utils'
import { EMPTY_FILTER_ERR_MSG } from 'app/constants/messages/errors'
import {
  AppNotFoundError,
  AppValidationError,
} from 'app/utils/errors/appErrors'
import * as db from 'database/utils/db'
import { registerModel } from 'database/utils/registerModels'
import { DiTokenEnum } from 'lib/dependency-injection'
import {
  IDeleteManyTrackHistoryFilter,
  IGetAllTrackHistoryFilter,
  TrackHistoryService,
} from 'modules/trackHistory/service'

let trackHistoryService: TrackHistoryService

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  registerModel(DiTokenEnum.TrackHistory)
  registerModel(DiTokenEnum.Track)

  trackHistoryService = DiContainer.resolve(TrackHistoryService)
})

afterEach(async () => {
  DiContainer.clearInstances()
  await db.clear()
})

afterAll(async () => {
  await db.drop()
  await db.disconnect()
})

describe('Track history service', () => {
  describe('Create one track history', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(trackHistoryService, 'createOne')
    })

    it('with correct data created successfully', async () => {
      const creationPayload = fakeServiceTrackHistoryPayload()
      const newTrackHistory = await trackHistoryService.createOne(
        creationPayload,
      )

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(creationPayload)
      expect(newTrackHistory).toBeTruthy()
    })

    it('with incorrect data throw validation error', async () => {
      const creationPayload = fakeServiceTrackHistoryPayload({
        isIncorrect: true,
      })

      try {
        const newTrackHistory = await trackHistoryService.createOne(
          creationPayload,
        )

        expect(newTrackHistory).not.toBeTruthy()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(creationPayload)
        expect(error).toBeInstanceOf(AppValidationError)
      }
    })
  })

  describe('Get all track histories', () => {
    let getAllSpy: jest.SpyInstance

    beforeEach(() => {
      getAllSpy = jest.spyOn(trackHistoryService, 'getAll')
    })

    it('with empty filter', async () => {
      await trackHistoryService.createOne(fakeServiceTrackHistoryPayload())
      await trackHistoryService.createOne(fakeServiceTrackHistoryPayload())

      const filter = {}
      const trackHistories = await trackHistoryService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(trackHistories).toHaveLength(2)
    })

    it('by user which has track histories', async () => {
      const creationPayload1 = fakeServiceTrackHistoryPayload()
      const creationPayload2 = fakeServiceTrackHistoryPayload()

      await trackHistoryService.createOne(creationPayload1)
      await trackHistoryService.createOne(creationPayload2)

      const filter: IGetAllTrackHistoryFilter = {
        user: creationPayload1.user,
      }
      const trackHistories = await trackHistoryService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(trackHistories).toHaveLength(1)
    })

    it('by user which does not have track histories', async () => {
      const creationPayload = fakeServiceTrackHistoryPayload()
      await trackHistoryService.createOne(creationPayload)

      const filter: IGetAllTrackHistoryFilter = { user: fakeEntityId() }
      const trackHistories = await trackHistoryService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(trackHistories).toHaveLength(0)
    })
  })

  describe('Delete one track history by id', () => {
    let deleteOneByIdSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneByIdSpy = jest.spyOn(trackHistoryService, 'deleteOneById')
    })

    it('which exists', async () => {
      const newTrackHistory = await trackHistoryService.createOne(
        fakeServiceTrackHistoryPayload(),
      )

      const deletedTrackHistory = await trackHistoryService.deleteOneById(
        newTrackHistory.id,
      )

      expect(deleteOneByIdSpy).toBeCalledTimes(1)
      expect(deleteOneByIdSpy).toBeCalledWith(newTrackHistory.id)
      expect(deletedTrackHistory).toBeTruthy()
    })

    it('which does not exist and throw not found error', async () => {
      const trackHistoryId = fakeEntityId()

      try {
        const deletedTrackHistory = await trackHistoryService.deleteOneById(
          trackHistoryId,
        )

        expect(deletedTrackHistory).not.toBeTruthy()
      } catch (error) {
        expect(deleteOneByIdSpy).toBeCalledTimes(1)
        expect(deleteOneByIdSpy).toBeCalledWith(trackHistoryId)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })
  })

  describe('Delete many track histories', () => {
    let deleteManySpy: jest.SpyInstance
    let creationPayload1: ReturnType<typeof fakeServiceTrackHistoryPayload>
    let creationPayload2: ReturnType<typeof fakeServiceTrackHistoryPayload>

    beforeEach(async () => {
      deleteManySpy = jest.spyOn(trackHistoryService, 'deleteMany')

      creationPayload1 = fakeServiceTrackHistoryPayload()
      creationPayload2 = fakeServiceTrackHistoryPayload()

      await trackHistoryService.createOne(creationPayload1)
      await trackHistoryService.createOne(creationPayload2)
    })

    it('with empty filter', async () => {
      const filter = {}

      try {
        const deletionResult = await trackHistoryService.deleteMany(filter)
        expect(deletionResult).not.toBeTruthy()
      } catch (error: any) {
        expect(deleteManySpy).toBeCalledTimes(1)
        expect(deleteManySpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(AppValidationError)
        expect(error.message).toBe(EMPTY_FILTER_ERR_MSG)
      }
    })

    it('by tracks which exists', async () => {
      const filter: IDeleteManyTrackHistoryFilter = {
        trackIds: [creationPayload1.track],
      }

      const deletionResult = await trackHistoryService.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(1)
    })

    it('by tracks which do not exist', async () => {
      const filter: IDeleteManyTrackHistoryFilter = {
        trackIds: [fakeEntityId()],
      }

      const deletionResult = await trackHistoryService.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(0)
    })
  })
})
