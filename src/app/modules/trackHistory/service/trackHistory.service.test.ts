import { container as DiContainer } from 'tsyringe'

import { fakeServiceTrackHistoryPayload } from '__tests__/fakeData/trackHistory'
import { setupDB } from '__tests__/utils'
import { EMPTY_FILTER_ERR_MSG } from 'app/constants/messages/errors'
import {
  AppNotFoundError,
  AppValidationError,
} from 'app/utils/errors/appErrors'
import { EntityNamesEnum } from 'database/constants'
import { TrackModel } from 'database/models/track'
import { TrackHistoryModel } from 'database/models/trackHistory'
import generateEntityId from 'database/utils/generateEntityId'
import getModelName from 'database/utils/getModelName'
import {
  IDeleteManyTrackHistoryFilter,
  IGetAllTrackHistoryFilter,
  TrackHistoryService,
} from 'modules/trackHistory/service'

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
      const trackHistoryPayload = fakeServiceTrackHistoryPayload()
      const newTrackHistory = await trackHistoryService.createOne(
        trackHistoryPayload,
      )

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(trackHistoryPayload)
      expect(newTrackHistory).toBeDefined()
    })

    it('with incorrect data and throw validation error', async () => {
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

    it('by user id which exists', async () => {
      const newTrackHistory = await trackHistoryService.createOne(
        fakeServiceTrackHistoryPayload(),
      )

      const filter: IGetAllTrackHistoryFilter = {
        user: newTrackHistory.user.toString(),
      }
      const trackHistories = await trackHistoryService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(trackHistories).toHaveLength(1)
    })

    it('by user id which not exists', async () => {
      const filter: IGetAllTrackHistoryFilter = { user: generateEntityId() }
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
      expect(deletedTrackHistory).toBeDefined()
    })

    it('which not exist and throw not found error', async () => {
      const trackHistoryId = generateEntityId()

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
        expect(deletionResult).not.toBeDefined()
      } catch (error: any) {
        expect(deleteManySpy).toBeCalledTimes(1)
        expect(deleteManySpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(AppValidationError)
        expect(error.message).toBe(EMPTY_FILTER_ERR_MSG)
      }
    })

    it('by track ids', async () => {
      const filter: IDeleteManyTrackHistoryFilter = {
        trackIds: [trackHistoryPayload1.track, trackHistoryPayload2.track],
      }

      const deletionResult = await trackHistoryService.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult).toBeUndefined()
    })
  })
})
