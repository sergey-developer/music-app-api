import { container as DiContainer } from 'tsyringe'

import { fakeRepoTrackHistoryPayload } from '__tests__/fakeData/trackHistory'
import { fakeEntityId } from '__tests__/fakeData/utils'
import { DatabaseNotFoundError, DatabaseValidationError } from 'database/errors'
import { TrackModel } from 'database/models/track'
import { TrackHistoryModel } from 'database/models/trackHistory'
import * as db from 'database/utils/db'
import { DiTokenEnum } from 'lib/dependency-injection'
import {
  IDeleteManyTrackHistoryFilter,
  IDeleteOneTrackHistoryFilter,
  IFindAllTrackHistoryFilter,
  TrackHistoryRepository,
} from 'modules/trackHistory/repository'

let trackHistoryRepository: TrackHistoryRepository

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

  trackHistoryRepository = DiContainer.resolve(TrackHistoryRepository)
})

afterEach(async () => {
  DiContainer.clearInstances()
  await db.clear()
})

afterAll(async () => {
  await db.drop()
  await db.disconnect()
})

describe('Track history repository', () => {
  describe('Create one track history', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(trackHistoryRepository, 'createOne')
    })

    it('with correct data created successfully', async () => {
      const trackHistoryPayload = fakeRepoTrackHistoryPayload()
      const newTrackHistory = await trackHistoryRepository.createOne(
        trackHistoryPayload,
      )

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(trackHistoryPayload)
      expect(newTrackHistory.populated('track').toString()).toBe(
        trackHistoryPayload.track,
      )
      expect(newTrackHistory.user.toString()).toBe(trackHistoryPayload.user)
      expect(newTrackHistory.listenDate).toBe(trackHistoryPayload.listenDate)
    })

    it('with incorrect data throw validation error', async () => {
      const trackHistoryPayload = fakeRepoTrackHistoryPayload(null, {
        isIncorrect: true,
      })

      try {
        const newTrackHistory = await trackHistoryRepository.createOne(
          trackHistoryPayload,
        )

        expect(newTrackHistory).not.toBeTruthy()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(trackHistoryPayload)
        expect(error).toBeInstanceOf(DatabaseValidationError)
      }
    })
  })

  describe('Find all track histories', () => {
    let findAllWhereSpy: jest.SpyInstance

    beforeEach(() => {
      findAllWhereSpy = jest.spyOn(trackHistoryRepository, 'findAllWhere')
    })

    it('with empty filter', async () => {
      await trackHistoryRepository.createOne(fakeRepoTrackHistoryPayload())
      await trackHistoryRepository.createOne(fakeRepoTrackHistoryPayload())

      const filter = {}
      const trackHistories = await trackHistoryRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(trackHistories)).toBe(true)
      expect(trackHistories).toHaveLength(2)
    })

    it('by user id which exists', async () => {
      const newTrackHistory = await trackHistoryRepository.createOne(
        fakeRepoTrackHistoryPayload(),
      )

      const filter: IFindAllTrackHistoryFilter = {
        user: newTrackHistory.user.toString(),
      }
      const trackHistories = await trackHistoryRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(trackHistories)).toBe(true)
      expect(trackHistories).toHaveLength(1)
    })

    it('by user id which not exists', async () => {
      const filter: IFindAllTrackHistoryFilter = { user: fakeEntityId() }
      const trackHistories = await trackHistoryRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(trackHistories)).toBe(true)
      expect(trackHistories).toHaveLength(0)
    })
  })

  describe('Delete one track history', () => {
    let deleteOneSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneSpy = jest.spyOn(trackHistoryRepository, 'deleteOne')
    })

    it('by id which exists', async () => {
      const newTrackHistory = await trackHistoryRepository.createOne(
        fakeRepoTrackHistoryPayload(),
      )

      const filter: IDeleteOneTrackHistoryFilter = { id: newTrackHistory.id }
      const deletedTrackHistory = await trackHistoryRepository.deleteOne(filter)

      expect(deleteOneSpy).toBeCalledTimes(1)
      expect(deleteOneSpy).toBeCalledWith(filter)
      expect(deletedTrackHistory.id).toBe(newTrackHistory.id)
      expect(deletedTrackHistory.track.toString()).toBe(
        newTrackHistory.populated('track').toString(),
      )
      expect(deletedTrackHistory.listenDate).toBe(newTrackHistory.listenDate)
      expect(deletedTrackHistory.user.toString()).toEqual(
        newTrackHistory.user.toString(),
      )
    })

    it('by id which not exist and throw not found error', async () => {
      const filter: IDeleteOneTrackHistoryFilter = { id: fakeEntityId() }

      try {
        const deletedTrackHistory = await trackHistoryRepository.deleteOne(
          filter,
        )

        expect(deletedTrackHistory).not.toBeTruthy()
      } catch (error) {
        expect(deleteOneSpy).toBeCalledTimes(1)
        expect(deleteOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })
  })

  describe('Delete many track histories', () => {
    let deleteManySpy: jest.SpyInstance
    let trackHistoryPayload1: ReturnType<typeof fakeRepoTrackHistoryPayload>
    let trackHistoryPayload2: ReturnType<typeof fakeRepoTrackHistoryPayload>

    beforeEach(async () => {
      deleteManySpy = jest.spyOn(trackHistoryRepository, 'deleteMany')

      trackHistoryPayload1 = fakeRepoTrackHistoryPayload()
      trackHistoryPayload2 = fakeRepoTrackHistoryPayload()

      await trackHistoryRepository.createOne(trackHistoryPayload1)
      await trackHistoryRepository.createOne(trackHistoryPayload2)
      await trackHistoryRepository.createOne(fakeRepoTrackHistoryPayload())
    })

    it('with empty filter', async () => {
      const filter = {}
      const deletionResult = await trackHistoryRepository.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(3)
    })

    it('by track ids which exists', async () => {
      const filter: IDeleteManyTrackHistoryFilter = {
        trackIds: [trackHistoryPayload1.track, trackHistoryPayload2.track],
      }

      const deletionResult = await trackHistoryRepository.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(2)
    })

    it('by track ids which not exists', async () => {
      const filter: IDeleteManyTrackHistoryFilter = {
        trackIds: [fakeEntityId()],
      }

      const deletionResult = await trackHistoryRepository.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(0)
    })
  })
})
