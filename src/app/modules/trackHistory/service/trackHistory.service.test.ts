import { container as DiContainer } from 'tsyringe'

import { fakeServiceTrackHistoryPayload } from '__tests__/fakeData/trackHistory'
import { fakeEntityId } from '__tests__/fakeData/utils'
import { EMPTY_FILTER_ERR_MSG } from 'app/constants/messages/errors'
import {
  AppNotFoundError,
  AppValidationError,
} from 'app/utils/errors/appErrors'
import { TrackModel } from 'database/models/track'
import { TrackHistoryModel } from 'database/models/trackHistory'
import * as db from 'database/utils/db'
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
  DiContainer.register(DiTokenEnum.TrackHistory, {
    useValue: TrackHistoryModel,
  })

  DiContainer.register(DiTokenEnum.Track, {
    useValue: TrackModel,
  })

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
      const trackHistoryPayload = fakeServiceTrackHistoryPayload()
      const newTrackHistory = await trackHistoryService.createOne(
        trackHistoryPayload,
      )

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(trackHistoryPayload)
      expect(newTrackHistory).toBeTruthy()
    })

    it('with incorrect data throw validation error', async () => {
      const trackHistoryPayload = fakeServiceTrackHistoryPayload({
        isIncorrect: true,
      })

      try {
        const newTrackHistory = await trackHistoryService.createOne(
          trackHistoryPayload,
        )

        expect(newTrackHistory).not.toBeDefined()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(trackHistoryPayload)
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
      const payload1 = fakeServiceTrackHistoryPayload()
      const payload2 = fakeServiceTrackHistoryPayload()

      await trackHistoryService.createOne(payload1)
      await trackHistoryService.createOne(payload2)

      const filter: IGetAllTrackHistoryFilter = {
        user: payload1.user,
      }
      const trackHistories = await trackHistoryService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(trackHistories).toHaveLength(1)
    })

    it('by user which do not have track histories', async () => {
      const payload = fakeServiceTrackHistoryPayload()
      await trackHistoryService.createOne(payload)

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

    it('which not exist and throw not found error', async () => {
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
    let trackHistoryPayload1: ReturnType<typeof fakeServiceTrackHistoryPayload>
    let trackHistoryPayload2: ReturnType<typeof fakeServiceTrackHistoryPayload>

    beforeEach(async () => {
      deleteManySpy = jest.spyOn(trackHistoryService, 'deleteMany')

      trackHistoryPayload1 = fakeServiceTrackHistoryPayload()
      trackHistoryPayload2 = fakeServiceTrackHistoryPayload()

      await trackHistoryService.createOne(trackHistoryPayload1)
      await trackHistoryService.createOne(trackHistoryPayload2)
      await trackHistoryService.createOne(fakeServiceTrackHistoryPayload())
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

    it('by track ids which exists', async () => {
      const filter: IDeleteManyTrackHistoryFilter = {
        trackIds: [trackHistoryPayload1.track, trackHistoryPayload2.track],
      }

      const deletionResult = await trackHistoryService.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult).toBeTruthy()
    })

    it('by track ids which not exists', async () => {
      const filter: IDeleteManyTrackHistoryFilter = {
        trackIds: [fakeEntityId()],
      }

      const deletionResult = await trackHistoryService.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult).toBeTruthy()
    })
  })
})
