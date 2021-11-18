import { container as DiContainer } from 'tsyringe'

import { fakeCreateTrackHistoryPayload } from '__tests__/fakeData/trackHistory'
import { setupDB } from '__tests__/utils'
import EntityNamesEnum from 'database/constants/entityNamesEnum'
import generateMongoId from 'database/utils/generateMongoId'
import getModelName from 'database/utils/getModelName'
import { TrackModel } from 'modules/track/model'
import { TrackHistoryModel } from 'modules/trackHistory/model'
import { TrackHistoryService } from 'modules/trackHistory/service'
import { isBadRequestError } from 'shared/utils/errors/httpErrors'

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

    it('with incorrect data throws error', async () => {
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
        expect(isBadRequestError(error)).toBe(true)
      }
    })
  })

  // describe('Find track histories where filter', () => {
  //   let findAllWhereSpy: jest.SpyInstance
  //
  //   beforeEach(() => {
  //     findAllWhereSpy = jest.spyOn(trackHistoryRepository, 'findAllWhere')
  //   })
  //
  //   it('is empty', async () => {
  //     const trackHistoryPayload1 = fakeCreateTrackHistoryPayload()
  //     const trackHistoryPayload2 = fakeCreateTrackHistoryPayload()
  //
  //     await trackHistoryRepository.createOne(trackHistoryPayload1)
  //     await trackHistoryRepository.createOne(trackHistoryPayload2)
  //
  //     const filter = {}
  //     const trackHistories = await trackHistoryRepository.findAllWhere(filter)
  //
  //     expect(findAllWhereSpy).toBeCalledTimes(1)
  //     expect(findAllWhereSpy).toBeCalledWith(filter)
  //     expect(Array.isArray(trackHistories)).toBe(true)
  //     expect(trackHistories).toHaveLength(2)
  //   })
  //
  //   it('has user id which exists', async () => {
  //     const trackHistoryPayload = fakeCreateTrackHistoryPayload()
  //     const newTrackHistory = await trackHistoryRepository.createOne(
  //       trackHistoryPayload,
  //     )
  //
  //     const filter = { user: newTrackHistory.user.toString() }
  //     const trackHistories = await trackHistoryRepository.findAllWhere(filter)
  //
  //     expect(findAllWhereSpy).toBeCalledTimes(1)
  //     expect(findAllWhereSpy).toBeCalledWith(filter)
  //     expect(Array.isArray(trackHistories)).toBe(true)
  //     expect(trackHistories).toHaveLength(1)
  //   })
  //
  //   it('has user id which not exists', async () => {
  //     const filter = { user: generateMongoId() }
  //     const trackHistories = await trackHistoryRepository.findAllWhere(filter)
  //
  //     expect(findAllWhereSpy).toBeCalledTimes(1)
  //     expect(findAllWhereSpy).toBeCalledWith(filter)
  //     expect(Array.isArray(trackHistories)).toBe(true)
  //     expect(trackHistories).toHaveLength(0)
  //   })
  // })
  //
  // describe('Delete one track history where filter', () => {
  //   let deleteOneSpy: jest.SpyInstance
  //
  //   beforeEach(() => {
  //     deleteOneSpy = jest.spyOn(trackHistoryRepository, 'deleteOne')
  //   })
  //
  //   it('has id which exists', async () => {
  //     const trackHistoryPayload = fakeCreateTrackHistoryPayload()
  //     const newTrackHistory = await trackHistoryRepository.createOne(
  //       trackHistoryPayload,
  //     )
  //
  //     const filter = { id: newTrackHistory.id }
  //     const deletedTrackHistory = await trackHistoryRepository.deleteOne(filter)
  //
  //     expect(deleteOneSpy).toBeCalledTimes(1)
  //     expect(deleteOneSpy).toBeCalledWith(filter)
  //     expect(deletedTrackHistory.id).toBe(newTrackHistory.id)
  //     expect(deletedTrackHistory.track).not.toBe(newTrackHistory.track)
  //     expect(deletedTrackHistory.listenDate).toBe(newTrackHistory.listenDate)
  //     expect(deletedTrackHistory.user).toEqual(newTrackHistory.user)
  //   })
  //
  //   it('has id which not exist and throws error', async () => {
  //     const filter = { id: generateMongoId() }
  //
  //     try {
  //       const deletedTrackHistory = await trackHistoryRepository.deleteOne(
  //         filter,
  //       )
  //
  //       expect(deletedTrackHistory).not.toBeDefined()
  //     } catch (error) {
  //       expect(deleteOneSpy).toBeCalledTimes(1)
  //       expect(deleteOneSpy).toBeCalledWith(filter)
  //       expect(error).toBeDefined()
  //     }
  //   })
  // })
  //
  // describe('Delete many track histories where filter', () => {
  //   let deleteManySpy: jest.SpyInstance
  //   let trackHistoryPayload1: ReturnType<typeof fakeCreateTrackHistoryPayload>
  //   let trackHistoryPayload2: ReturnType<typeof fakeCreateTrackHistoryPayload>
  //   let trackHistoryPayload3: ReturnType<typeof fakeCreateTrackHistoryPayload>
  //
  //   beforeEach(async () => {
  //     deleteManySpy = jest.spyOn(trackHistoryRepository, 'deleteMany')
  //
  //     trackHistoryPayload1 = fakeCreateTrackHistoryPayload()
  //     trackHistoryPayload2 = fakeCreateTrackHistoryPayload()
  //     trackHistoryPayload3 = fakeCreateTrackHistoryPayload()
  //
  //     await trackHistoryRepository.createOne(trackHistoryPayload1)
  //     await trackHistoryRepository.createOne(trackHistoryPayload2)
  //     await trackHistoryRepository.createOne(trackHistoryPayload3)
  //   })
  //
  //   it('is empty', async () => {
  //     const filter = {}
  //     const deletionResult = await trackHistoryRepository.deleteMany(filter)
  //
  //     expect(deleteManySpy).toBeCalledTimes(1)
  //     expect(deleteManySpy).toBeCalledWith(filter)
  //     expect(deletionResult.deletedCount).toBe(3)
  //   })
  //
  //   it('has track ids', async () => {
  //     const filter = {
  //       trackIds: [trackHistoryPayload1.track, trackHistoryPayload2.track],
  //     }
  //
  //     const deletionResult = await trackHistoryRepository.deleteMany(filter)
  //
  //     expect(deleteManySpy).toBeCalledTimes(1)
  //     expect(deleteManySpy).toBeCalledWith(filter)
  //     expect(deletionResult.deletedCount).toBe(2)
  //   })
  // })
})
