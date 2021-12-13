import { container as DiContainer } from 'tsyringe'

import { fakeAlbumPayload } from '__tests__/fakeData/album'
import { fakeArtistPayload } from '__tests__/fakeData/artist'
import { fakeServiceTrackPayload } from '__tests__/fakeData/track'
import { fakeRepoTrackHistoryPayload } from '__tests__/fakeData/trackHistory'
import { fakeEntityId } from '__tests__/fakeData/utils'
import { EMPTY_FILTER_ERR_MSG } from 'app/constants/messages/errors'
import {
  AppNotFoundError,
  AppValidationError,
} from 'app/utils/errors/appErrors'
import { ITrackDocument } from 'database/models/track'
import * as db from 'database/utils/db'
import { registerModel } from 'database/utils/registerModels'
import { DiTokenEnum } from 'lib/dependency-injection'
import { AlbumRepository } from 'modules/album/repository'
import { ArtistRepository } from 'modules/artist/repository'
import { RequestStatusEnum } from 'modules/request/constants'
import { RequestRepository } from 'modules/request/repository'
import {
  IDeleteManyTracksFilter,
  IGetAllTracksFilter,
  TrackService,
} from 'modules/track/service'
import { TrackHistoryRepository } from 'modules/trackHistory/repository'

let artistRepository: ArtistRepository
let albumRepository: AlbumRepository
let trackService: TrackService
let trackHistoryRepository: TrackHistoryRepository
let requestRepository: RequestRepository

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  registerModel(DiTokenEnum.Artist)
  registerModel(DiTokenEnum.Album)
  registerModel(DiTokenEnum.Track)
  registerModel(DiTokenEnum.TrackHistory)
  registerModel(DiTokenEnum.Request)

  artistRepository = DiContainer.resolve(ArtistRepository)
  albumRepository = DiContainer.resolve(AlbumRepository)
  trackService = DiContainer.resolve(TrackService)
  trackHistoryRepository = DiContainer.resolve(TrackHistoryRepository)
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

describe('Track service', () => {
  describe('Create one track', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(trackService, 'createOne')
    })

    it('with correct data created successfully', async () => {
      const trackPayload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(trackPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(trackPayload)
      expect(newTrack).toBeTruthy()
    })

    it('with correct data request successfully created for new track', async () => {
      const trackPayload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(trackPayload)

      const trackRequest = await requestRepository.findOne({
        entity: newTrack.id,
      })

      expect(trackRequest.entity.id).toBe(newTrack.id)
    })

    it('with incorrect data throw validation error', async () => {
      const trackPayload = fakeServiceTrackPayload(null, {
        isIncorrect: true,
      })

      try {
        const newTrack = await trackService.createOne(trackPayload)
        expect(newTrack).not.toBeTruthy()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(trackPayload)
        expect(error).toBeInstanceOf(AppValidationError)
      }
    })
  })

  describe('Update one track by id', () => {
    let updateOneByIdSpy: jest.SpyInstance

    beforeEach(() => {
      updateOneByIdSpy = jest.spyOn(trackService, 'updateOneById')
    })

    it('with correct data updated successfully', async () => {
      const trackPayload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(trackPayload)

      const trackUpdates = fakeServiceTrackPayload()
      const updatedTrack = await trackService.updateOneById(
        newTrack.id,
        trackUpdates,
      )

      expect(updateOneByIdSpy).toBeCalledTimes(1)
      expect(updateOneByIdSpy).toBeCalledWith(newTrack.id, trackUpdates)
      expect(updatedTrack).toBeTruthy()
    })

    it('with incorrect data throw validation error', async () => {
      const trackPayload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(trackPayload)

      const trackUpdates = fakeServiceTrackPayload(null, { isIncorrect: true })

      try {
        const updatedTrack = await trackService.updateOneById(
          newTrack.id,
          trackUpdates,
        )

        expect(updatedTrack).not.toBeTruthy()
      } catch (error) {
        expect(updateOneByIdSpy).toBeCalledTimes(1)
        expect(updateOneByIdSpy).toBeCalledWith(newTrack.id, trackUpdates)
        expect(error).toBeInstanceOf(AppValidationError)
      }
    })

    it('which not exist and throw not found error', async () => {
      const trackId = fakeEntityId()
      const trackUpdates = fakeServiceTrackPayload()

      try {
        const updatedTrack = await trackService.updateOneById(
          trackId,
          trackUpdates,
        )

        expect(updatedTrack).not.toBeTruthy()
      } catch (error) {
        expect(updateOneByIdSpy).toBeCalledTimes(1)
        expect(updateOneByIdSpy).toBeCalledWith(trackId, trackUpdates)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })
  })

  describe('Get all tracks', () => {
    let getAllSpy: jest.SpyInstance

    beforeEach(() => {
      getAllSpy = jest.spyOn(trackService, 'getAll')
    })

    it('with empty filter', async () => {
      await trackService.createOne(fakeServiceTrackPayload())
      await trackService.createOne(fakeServiceTrackPayload())

      const filter = {}
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(2)
    })

    it('by user', async () => {
      const payload1 = fakeServiceTrackPayload()
      const payload2 = fakeServiceTrackPayload()

      await trackService.createOne(payload1)
      await trackService.createOne(payload2)

      const filter: IGetAllTracksFilter = { userId: payload1.user }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(1)
    })

    it('by pending status', async () => {
      const newTrack1 = await trackService.createOne(fakeServiceTrackPayload())
      await trackService.createOne(fakeServiceTrackPayload())

      await requestRepository.updateOne(
        { entity: newTrack1.id },
        { status: RequestStatusEnum.Approved },
      )

      const filter: IGetAllTracksFilter = { status: RequestStatusEnum.Pending }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(1)
    })

    it('by approved status', async () => {
      await trackService.createOne(fakeServiceTrackPayload())
      const newTrack2 = await trackService.createOne(fakeServiceTrackPayload())

      await requestRepository.updateOne(
        { entity: newTrack2.id },
        { status: RequestStatusEnum.Approved },
      )

      const filter: IGetAllTracksFilter = { status: RequestStatusEnum.Approved }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(1)
    })

    it('by rejected status', async () => {
      await trackService.createOne(fakeServiceTrackPayload())
      const newTrack2 = await trackService.createOne(fakeServiceTrackPayload())

      await requestRepository.updateOne(
        { entity: newTrack2.id },
        { status: RequestStatusEnum.Rejected },
      )

      const filter: IGetAllTracksFilter = { status: RequestStatusEnum.Rejected }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(1)
    })

    it('by artist which has tracks', async () => {
      const artist1 = await artistRepository.createOne(fakeArtistPayload())
      const artist2 = await artistRepository.createOne(fakeArtistPayload())

      const albumOfArtist1 = await albumRepository.createOne(
        fakeAlbumPayload({ artist: artist1.id }),
      )
      const albumOfArtist2 = await albumRepository.createOne(
        fakeAlbumPayload({ artist: artist2.id }),
      )

      await trackService.createOne(
        fakeServiceTrackPayload({ album: albumOfArtist1.id }),
      )
      await trackService.createOne(
        fakeServiceTrackPayload({ album: albumOfArtist2.id }),
      )

      const filter: IGetAllTracksFilter = { artist: artist1.id }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(1)
    })

    it('by artist which does not have tracks', async () => {
      const artist = await artistRepository.createOne(fakeArtistPayload())

      const album = await albumRepository.createOne(
        fakeAlbumPayload({ artist: artist.id }),
      )

      await trackService.createOne(fakeServiceTrackPayload({ album: album.id }))

      const filter: IGetAllTracksFilter = { artist: fakeEntityId() }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(0)
    })

    it('by albums which have tracks', async () => {
      const trackPayload1 = fakeServiceTrackPayload()
      const trackPayload2 = fakeServiceTrackPayload()

      await trackService.createOne(trackPayload1)
      await trackService.createOne(trackPayload2)

      const filter: IGetAllTracksFilter = { albumIds: [trackPayload1.album] }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(1)
    })

    it('by albums which do not have tracks', async () => {
      const payload = fakeServiceTrackPayload()
      await trackService.createOne(payload)

      const filter: IGetAllTracksFilter = { albumIds: [fakeEntityId()] }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(0)
    })
  })

  describe('Get one track by id', () => {
    let getOneByIdSpy: jest.SpyInstance

    beforeEach(() => {
      getOneByIdSpy = jest.spyOn(trackService, 'getOneById')
    })

    it('which exists', async () => {
      const payload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(payload)

      const track = await trackService.getOneById(newTrack.id)

      expect(getOneByIdSpy).toBeCalledTimes(1)
      expect(getOneByIdSpy).toBeCalledWith(newTrack.id)
      expect(track).toBeTruthy()
    })

    it('which not exists', async () => {
      const fakeId = fakeEntityId()

      try {
        const track = await trackService.getOneById(fakeId)
        expect(track).not.toBeTruthy()
      } catch (error) {
        expect(getOneByIdSpy).toBeCalledTimes(1)
        expect(getOneByIdSpy).toBeCalledWith(fakeId)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })
  })

  describe('Delete one track by id', () => {
    let deleteOneByIdSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneByIdSpy = jest.spyOn(trackService, 'deleteOneById')
    })

    it('which exists', async () => {
      const payload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(payload)

      const deletedTrack = await trackService.deleteOneById(newTrack.id)

      expect(deleteOneByIdSpy).toBeCalledTimes(1)
      expect(deleteOneByIdSpy).toBeCalledWith(newTrack.id)
      expect(deletedTrack).toBeTruthy()
    })

    it('which not exist and throw not found error', async () => {
      const fakeId = fakeEntityId()

      try {
        const deletedTrack = await trackService.deleteOneById(fakeId)
        expect(deletedTrack).not.toBeTruthy()
      } catch (error) {
        expect(deleteOneByIdSpy).toBeCalledTimes(1)
        expect(deleteOneByIdSpy).toBeCalledWith(fakeId)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })

    it('request of track was successfully deleted', async () => {
      const payload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(payload)

      const deletedTrack = await trackService.deleteOneById(newTrack.id)

      const requests = await requestRepository.findAllWhere({
        entityIds: [deletedTrack.id],
      })

      expect(requests).toHaveLength(0)
    })

    it('track histories of track were successfully deleted', async () => {
      const newTrack = await trackService.createOne(fakeServiceTrackPayload())

      await trackHistoryRepository.createOne(
        fakeRepoTrackHistoryPayload({ track: newTrack.id }),
      )

      const deletedTrack = await trackService.deleteOneById(newTrack.id)

      const trackHistories = await trackHistoryRepository.findAllWhere({
        track: deletedTrack.id,
      })

      expect(trackHistories).toHaveLength(0)
    })
  })

  describe('Delete many tracks', () => {
    let deleteManySpy: jest.SpyInstance
    let newTrack1: ITrackDocument
    let newTrack2: ITrackDocument

    beforeEach(async () => {
      deleteManySpy = jest.spyOn(trackService, 'deleteMany')

      newTrack1 = await trackService.createOne(fakeServiceTrackPayload())
      newTrack2 = await trackService.createOne(fakeServiceTrackPayload())
    })

    it('with empty filter', async () => {
      const filter = {}

      try {
        const deletionResult = await trackService.deleteMany(filter)
        expect(deletionResult).not.toBeTruthy()
      } catch (error: any) {
        expect(deleteManySpy).toBeCalledTimes(1)
        expect(deleteManySpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(AppValidationError)
        expect(error.message).toBe(EMPTY_FILTER_ERR_MSG)
      }
    })

    it('by tracks which exists', async () => {
      const filter: IDeleteManyTracksFilter = {
        tracks: [newTrack1],
      }

      const deletionResult = await trackService.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(1)
    })

    it('requests of tracks were successfully deleted', async () => {
      const filter: IDeleteManyTracksFilter = { tracks: [newTrack1] }
      await trackService.deleteMany(filter)

      const requests = await requestRepository.findAllWhere({
        entityIds: [newTrack1.id],
      })

      expect(requests).toHaveLength(0)
    })

    it('track histories of track were successfully deleted', async () => {
      await trackHistoryRepository.createOne(
        fakeRepoTrackHistoryPayload({ track: newTrack1.id }),
      )

      const filter: IDeleteManyTracksFilter = { tracks: [newTrack1] }
      await trackService.deleteMany(filter)

      const trackHistories = await trackHistoryRepository.findAllWhere({
        track: newTrack1.id,
      })

      expect(trackHistories).toHaveLength(0)
    })
  })
})
