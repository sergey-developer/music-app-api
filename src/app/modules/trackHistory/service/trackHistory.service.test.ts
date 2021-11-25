import { container as DiContainer } from 'tsyringe'

import { fakeCreateTrackHistoryPayload } from '__tests__/fakeData/trackHistory'
import { setupDB } from '__tests__/utils'
import EntityNamesEnum from 'database/constants/entityNamesEnum'
import generateMongoId from 'database/utils/generateMongoId'
import getModelName from 'database/utils/getModelName'
import { TrackModel } from 'modules/track/model'
import { TrackHistoryModel } from 'modules/trackHistory/model'
import { TrackHistoryService } from 'modules/trackHistory/service'
import { EMPTY_FILTER_ERR_MSG } from 'shared/constants/errorMessages'
import {
  AppNotFoundError,
  AppValidationError,
} from 'shared/utils/errors/appErrors'

let trackHistoryService: TrackHistoryService

setupDB()

beforeEach(() => {
  DiContainer.clearInstances()

  DiContainer.register(getModelName(EntityNamesEnum.TrackHistory), {
    useValue: TrackHistoryModel,
  })

  DiContainer.register(getModelName(EntityNamesEnum.Track), {
    useValue: TrackModel,
  })

  trackHistoryService = DiContainer.resolve(TrackHistoryService)
})

describe('Track history service', () => {
  describe('Create one track history', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(trackHistoryService, 'createOne')
    })

    it('with correct data', async () => {
      const trackHistoryPayload = fakeCreateTrackHistoryPayload()
      const newTrackHistory = await trackHistoryService.createOne(
        trackHistoryPayload,
      )

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(trackHistoryPayload)
      expect(typeof newTrackHistory.id).toBe('string')
      expect(newTrackHistory.id).toBeTruthy()
      expect(newTrackHistory.track).toBeNull()
      expect(newTrackHistory.track).not.toBe(trackHistoryPayload.track)
      expect(newTrackHistory.user.toString()).toBe(trackHistoryPayload.user)
      expect(newTrackHistory.listenDate).toBe(trackHistoryPayload.listenDate)
    })

    it('with incorrect data and throw validation error', async () => {
      const trackHistoryPayload = fakeCreateTrackHistoryPayload({
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

  describe('Get all track histories where filter', () => {
    let getAllSpy: jest.SpyInstance

    beforeEach(() => {
      getAllSpy = jest.spyOn(trackHistoryService, 'getAll')
    })

    it('is empty', async () => {
      const trackHistoryPayload1 = fakeCreateTrackHistoryPayload()
      const trackHistoryPayload2 = fakeCreateTrackHistoryPayload()

      await trackHistoryService.createOne(trackHistoryPayload1)
      await trackHistoryService.createOne(trackHistoryPayload2)

      const filter = {}
      const trackHistories = await trackHistoryService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(Array.isArray(trackHistories)).toBe(true)
      expect(trackHistories).toHaveLength(2)
    })

    it('has user id which exists', async () => {
      const trackHistoryPayload = fakeCreateTrackHistoryPayload()
      const newTrackHistory = await trackHistoryService.createOne(
        trackHistoryPayload,
      )

      const filter = { user: newTrackHistory.user.toString() }
      const trackHistories = await trackHistoryService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(Array.isArray(trackHistories)).toBe(true)
      expect(trackHistories).toHaveLength(1)
    })

    it('has user id which not exists', async () => {
      const filter = { user: generateMongoId() }
      const trackHistories = await trackHistoryService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(Array.isArray(trackHistories)).toBe(true)
      expect(trackHistories).toHaveLength(0)
    })
  })

  describe('Delete one track history by id', () => {
    let deleteOneByIdSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneByIdSpy = jest.spyOn(trackHistoryService, 'deleteOneById')
    })

    it('which exists', async () => {
      const trackHistoryPayload = fakeCreateTrackHistoryPayload()
      const newTrackHistory = await trackHistoryService.createOne(
        trackHistoryPayload,
      )

      const deletedTrackHistory = await trackHistoryService.deleteOneById(
        newTrackHistory.id,
      )

      expect(deleteOneByIdSpy).toBeCalledTimes(1)
      expect(deleteOneByIdSpy).toBeCalledWith(newTrackHistory.id)
      expect(deletedTrackHistory.id).toBe(newTrackHistory.id)
      expect(deletedTrackHistory.track).not.toBe(newTrackHistory.track)
      expect(deletedTrackHistory.listenDate).toBe(newTrackHistory.listenDate)
      expect(deletedTrackHistory.user).toEqual(newTrackHistory.user)
    })

    it('which not exist and throw not found error', async () => {
      const trackHistoryId = generateMongoId()

      try {
        const deletedTrackHistory = await trackHistoryService.deleteOneById(
          trackHistoryId,
        )

        expect(deletedTrackHistory).not.toBeDefined()
      } catch (error) {
        expect(deleteOneByIdSpy).toBeCalledTimes(1)
        expect(deleteOneByIdSpy).toBeCalledWith(trackHistoryId)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })
  })

  describe('Delete many track histories where filter', () => {
    let deleteManySpy: jest.SpyInstance
    let trackHistoryPayload1: ReturnType<typeof fakeCreateTrackHistoryPayload>
    let trackHistoryPayload2: ReturnType<typeof fakeCreateTrackHistoryPayload>
    let trackHistoryPayload3: ReturnType<typeof fakeCreateTrackHistoryPayload>

    beforeEach(async () => {
      deleteManySpy = jest.spyOn(trackHistoryService, 'deleteMany')

      trackHistoryPayload1 = fakeCreateTrackHistoryPayload()
      trackHistoryPayload2 = fakeCreateTrackHistoryPayload()
      trackHistoryPayload3 = fakeCreateTrackHistoryPayload()

      await trackHistoryService.createOne(trackHistoryPayload1)
      await trackHistoryService.createOne(trackHistoryPayload2)
      await trackHistoryService.createOne(trackHistoryPayload3)
    })

    it('is empty', async () => {
      const filter = {}

      try {
        const deletionResult = await trackHistoryService.deleteMany(filter)
        expect(deletionResult).not.toBeDefined()
      } catch (error: any) {
        expect(deleteManySpy).toBeCalledTimes(1)
        expect(deleteManySpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(AppValidationError)
        expect(error.message).toBe(EMPTY_FILTER_ERR_MSG)
      }
    })

    it('has track ids', async () => {
      const filter = {
        trackIds: [trackHistoryPayload1.track, trackHistoryPayload2.track],
      }

      const deletionResult = await trackHistoryService.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult).toBeUndefined()
    })
  })
})
