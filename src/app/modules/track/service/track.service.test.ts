import { container as DiContainer } from 'tsyringe'

import { fakeRepoAlbumPayload } from '__tests__/fakeData/album'
import { fakeRepoArtistPayload } from '__tests__/fakeData/artist'
import {
  fakeRepoTrackPayload,
  fakeServiceTrackPayload,
} from '__tests__/fakeData/track'
import { fakeRepoTrackHistoryPayload } from '__tests__/fakeData/trackHistory'
import { fakeEntityId } from '__tests__/utils'
import { EMPTY_FILTER_ERR_MSG } from 'app/constants/messages/errors'
import {
  AppNotFoundError,
  AppValidationError,
} from 'app/utils/errors/appErrors'
import { DatabaseNotFoundError } from 'database/errors'
import { ITrackDocument } from 'database/models/track'
import * as db from 'database/utils/db'
import { registerModel } from 'database/utils/registerModels'
import { DiTokenEnum } from 'lib/dependency-injection'
import { AlbumRepository } from 'modules/album/repository'
import { ArtistRepository } from 'modules/artist/repository'
import { RequestStatusEnum } from 'modules/request/constants'
import { RequestRepository } from 'modules/request/repository'
import { TrackRepository } from 'modules/track/repository'
import {
  IDeleteManyTracksFilter,
  IGetAllTracksFilter,
  TrackService,
} from 'modules/track/service'
import { TrackHistoryRepository } from 'modules/trackHistory/repository'

let artistRepository: ArtistRepository
let albumRepository: AlbumRepository
let trackService: TrackService
let trackRepository: TrackRepository
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
  trackRepository = DiContainer.resolve(TrackRepository)
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
      const creationPayload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(creationPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(creationPayload)
      expect(newTrack).toBeTruthy()
    })

    it('with correct data request successfully created for new track', async () => {
      const creationPayload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(creationPayload)

      const request = await requestRepository.findOne({
        entity: newTrack.id,
      })

      expect(request.entity.id).toBe(newTrack.id)
    })

    it('with incorrect data throw validation error', async () => {
      const creationPayload = fakeServiceTrackPayload(null, {
        isIncorrect: true,
      })

      try {
        const newTrack = await trackService.createOne(creationPayload)
        expect(newTrack).not.toBeTruthy()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(creationPayload)
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
      const creationPayload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(creationPayload)

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
      const creationPayload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(creationPayload)

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

    it('by user which has tracks', async () => {
      const creationPayload1 = fakeServiceTrackPayload()
      const creationPayload2 = fakeServiceTrackPayload()

      await trackService.createOne(creationPayload1)
      await trackService.createOne(creationPayload2)

      const filter: IGetAllTracksFilter = { userId: creationPayload1.user }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(1)
    })

    it('by user which does not have tracks', async () => {
      const creationPayload = fakeServiceTrackPayload()
      await trackService.createOne(creationPayload)

      const filter: IGetAllTracksFilter = { userId: fakeEntityId() }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(0)
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
      const artist1 = await artistRepository.createOne(fakeRepoArtistPayload())
      const artist2 = await artistRepository.createOne(fakeRepoArtistPayload())

      const album1 = await albumRepository.createOne(
        fakeRepoAlbumPayload({ artist: artist1.id }),
      )
      const album2 = await albumRepository.createOne(
        fakeRepoAlbumPayload({ artist: artist2.id }),
      )

      await trackService.createOne(
        fakeServiceTrackPayload({ album: album1.id }),
      )
      await trackService.createOne(
        fakeServiceTrackPayload({ album: album2.id }),
      )

      const filter: IGetAllTracksFilter = { artist: artist1.id }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(1)
    })

    it('by artist which does not have tracks', async () => {
      const artist = await artistRepository.createOne(fakeRepoArtistPayload())

      const album = await albumRepository.createOne(
        fakeRepoAlbumPayload({ artist: artist.id }),
      )

      await trackService.createOne(fakeServiceTrackPayload({ album: album.id }))

      const filter: IGetAllTracksFilter = { artist: fakeEntityId() }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(0)
    })

    it('by albums which have tracks', async () => {
      const creationPayload1 = fakeServiceTrackPayload()
      const creationPayload2 = fakeServiceTrackPayload()

      await trackService.createOne(creationPayload1)
      await trackService.createOne(creationPayload2)

      const filter: IGetAllTracksFilter = { albumIds: [creationPayload1.album] }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(1)
    })

    it('by albums which do not have tracks', async () => {
      const creationPayload = fakeServiceTrackPayload()
      await trackService.createOne(creationPayload)

      const filter: IGetAllTracksFilter = { albumIds: [fakeEntityId()] }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(0)
    })

    it('by album which has tracks', async () => {
      const creationPayload1 = fakeServiceTrackPayload()
      const creationPayload2 = fakeServiceTrackPayload()

      await trackService.createOne(creationPayload1)
      await trackService.createOne(creationPayload2)

      const filter: IGetAllTracksFilter = { albumId: creationPayload1.album }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(1)
    })

    it('by album which does not have tracks', async () => {
      const creationPayload = fakeServiceTrackPayload()
      await trackService.createOne(creationPayload)

      const filter: IGetAllTracksFilter = { albumId: fakeEntityId() }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(0)
    })

    it('if tracks do not have requests', async () => {
      const creationPayload1 = fakeRepoTrackPayload()
      const creationPayload2 = fakeRepoTrackPayload()

      await trackRepository.createOne(creationPayload1)
      await trackRepository.createOne(creationPayload2)

      const filter = {}
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
      const creationPayload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(creationPayload)

      const track = await trackService.getOneById(newTrack.id)

      expect(getOneByIdSpy).toBeCalledTimes(1)
      expect(getOneByIdSpy).toBeCalledWith(newTrack.id)
      expect(track).toBeTruthy()
    })

    it('which does not exist throw not found error', async () => {
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
      const creationPayload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(creationPayload)

      const deletedTrack = await trackService.deleteOneById(newTrack.id)

      expect(deleteOneByIdSpy).toBeCalledTimes(1)
      expect(deleteOneByIdSpy).toBeCalledWith(newTrack.id)
      expect(deletedTrack).toBeTruthy()
    })

    it('which does not exist and throw not found error', async () => {
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
      const creationPayload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(creationPayload)

      const deletedTrack = await trackService.deleteOneById(newTrack.id)

      try {
        const request = await requestRepository.findOne({
          entity: deletedTrack.id,
        })

        expect(request).not.toBeTruthy()
      } catch (error) {
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
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
      const filter: IDeleteManyTracksFilter = { tracks: [newTrack1, newTrack2] }
      await trackService.deleteMany(filter)

      const requests = await requestRepository.findAllWhere({
        entityIds: [newTrack1.id, newTrack2.id],
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
