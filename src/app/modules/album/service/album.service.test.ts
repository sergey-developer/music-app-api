import { container as DiContainer } from 'tsyringe'

import {
  fakeRepoAlbumPayload,
  fakeServiceAlbumPayload,
} from '__tests__/fakeData/album'
import { fakeServiceTrackPayload } from '__tests__/fakeData/track'
import { fakeEntityId } from '__tests__/fakeData/utils'
import { EMPTY_FILTER_ERR_MSG } from 'app/constants/messages/errors'
import { TrackRepository } from 'app/modules/track/repository'
import {
  AppNotFoundError,
  AppValidationError,
} from 'app/utils/errors/appErrors'
import { DatabaseNotFoundError } from 'database/errors'
import { IAlbumDocument } from 'database/models/album'
import * as db from 'database/utils/db'
import { registerModel } from 'database/utils/registerModels'
import { DiTokenEnum } from 'lib/dependency-injection'
import { AlbumRepository } from 'modules/album/repository'
import {
  AlbumService,
  IDeleteManyAlbumsFilter,
  IGetAllAlbumsFilter,
} from 'modules/album/service'
import { RequestStatusEnum } from 'modules/request/constants'
import { RequestRepository } from 'modules/request/repository'
import { TrackService } from 'modules/track/service'

let albumService: AlbumService
let albumRepository: AlbumRepository
let trackRepository: TrackRepository
let trackService: TrackService
let requestRepository: RequestRepository

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  registerModel(DiTokenEnum.Album)
  registerModel(DiTokenEnum.Track)
  registerModel(DiTokenEnum.TrackHistory)
  registerModel(DiTokenEnum.Request)

  albumService = DiContainer.resolve(AlbumService)
  albumRepository = DiContainer.resolve(AlbumRepository)
  trackRepository = DiContainer.resolve(TrackRepository)
  trackService = DiContainer.resolve(TrackService)
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

describe('Album service', () => {
  describe('Create one album', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(albumService, 'createOne')
    })

    it('with correct data created successfully', async () => {
      const creationPayload = fakeServiceAlbumPayload()
      const newAlbum = await albumService.createOne(creationPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(creationPayload)
      expect(newAlbum).toBeTruthy()
    })

    it('with correct data request successfully created for new album', async () => {
      const creationPayload = fakeServiceAlbumPayload()
      const newAlbum = await albumService.createOne(creationPayload)

      const request = await requestRepository.findOne({
        entity: newAlbum.id,
      })

      expect(request.entity.id).toBe(newAlbum.id)
    })

    it('with incorrect data throw validation error', async () => {
      const creationPayload = fakeServiceAlbumPayload(null, {
        isIncorrect: true,
      })

      try {
        const newAlbum = await albumService.createOne(creationPayload)
        expect(newAlbum).not.toBeTruthy()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(creationPayload)
        expect(error).toBeInstanceOf(AppValidationError)
      }
    })
  })

  describe('Update one album by id', () => {
    let updateOneByIdSpy: jest.SpyInstance

    beforeEach(() => {
      updateOneByIdSpy = jest.spyOn(albumService, 'updateOneById')
    })

    it('with correct data updated successfully', async () => {
      const creationPayload = fakeServiceAlbumPayload()
      const newAlbum = await albumService.createOne(creationPayload)

      const albumUpdates = fakeServiceAlbumPayload()
      const updatedAlbum = await albumService.updateOneById(
        newAlbum.id,
        albumUpdates,
      )

      expect(updateOneByIdSpy).toBeCalledTimes(1)
      expect(updateOneByIdSpy).toBeCalledWith(newAlbum.id, albumUpdates)
      expect(updatedAlbum).toBeTruthy()
    })

    it('with incorrect data throw validation error', async () => {
      const creationPayload = fakeServiceAlbumPayload()
      const newAlbum = await albumService.createOne(creationPayload)

      const albumUpdates = fakeServiceAlbumPayload(null, { isIncorrect: true })

      try {
        const updatedAlbum = await albumService.updateOneById(
          newAlbum.id,
          albumUpdates,
        )

        expect(updatedAlbum).not.toBeTruthy()
      } catch (error) {
        expect(updateOneByIdSpy).toBeCalledTimes(1)
        expect(updateOneByIdSpy).toBeCalledWith(newAlbum.id, albumUpdates)
        expect(error).toBeInstanceOf(AppValidationError)
      }
    })

    it('which not exist and throw not found error', async () => {
      const albumId = fakeEntityId()
      const albumUpdates = fakeServiceAlbumPayload()

      try {
        const updatedAlbum = await albumService.updateOneById(
          albumId,
          albumUpdates,
        )

        expect(updatedAlbum).not.toBeTruthy()
      } catch (error) {
        expect(updateOneByIdSpy).toBeCalledTimes(1)
        expect(updateOneByIdSpy).toBeCalledWith(albumId, albumUpdates)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })
  })

  describe('Get all albums', () => {
    let getAllSpy: jest.SpyInstance

    beforeEach(() => {
      getAllSpy = jest.spyOn(albumService, 'getAll')
    })

    it('with empty filter', async () => {
      const creationPayload1 = fakeServiceAlbumPayload()
      const creationPayload2 = fakeServiceAlbumPayload()

      await albumService.createOne(creationPayload1)
      await albumService.createOne(creationPayload2)

      const filter = {}
      const albums = await albumService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(albums).toHaveLength(2)
    })

    it('by artist which has albums', async () => {
      const creationPayload1 = fakeServiceAlbumPayload()
      const creationPayload2 = fakeServiceAlbumPayload()

      await albumService.createOne(creationPayload1)
      await albumService.createOne(creationPayload2)

      const filter: IGetAllAlbumsFilter = {
        artist: creationPayload1.artist,
      }

      const albums = await albumService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(albums).toHaveLength(1)
    })

    it('by artist which does not have albums', async () => {
      const creationPayload = fakeServiceAlbumPayload()
      await albumService.createOne(creationPayload)

      const filter: IGetAllAlbumsFilter = {
        artist: fakeEntityId(),
      }

      const albums = await albumService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(albums).toHaveLength(0)
    })

    it('by user which has albums', async () => {
      const creationPayload1 = fakeServiceAlbumPayload()
      const creationPayload2 = fakeServiceAlbumPayload()

      await albumService.createOne(creationPayload1)
      await albumService.createOne(creationPayload2)

      const filter: IGetAllAlbumsFilter = {
        userId: creationPayload1.user,
      }

      const albums = await albumService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(albums).toHaveLength(1)
    })

    it('by user which does not have albums', async () => {
      const creationPayload = fakeServiceAlbumPayload()
      await albumService.createOne(creationPayload)

      const filter: IGetAllAlbumsFilter = {
        userId: fakeEntityId(),
      }

      const albums = await albumService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(albums).toHaveLength(0)
    })

    it('by pending status', async () => {
      const creationPayload1 = fakeServiceAlbumPayload()
      const creationPayload2 = fakeServiceAlbumPayload()

      const newAlbum1 = await albumService.createOne(creationPayload1)
      await albumService.createOne(creationPayload2)

      await requestRepository.updateOne(
        { entity: newAlbum1.id },
        { status: RequestStatusEnum.Approved },
      )

      const filter: IGetAllAlbumsFilter = { status: RequestStatusEnum.Pending }
      const albums = await albumService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(albums).toHaveLength(1)
    })

    it('by approved status', async () => {
      const creationPayload1 = fakeServiceAlbumPayload()
      const creationPayload2 = fakeServiceAlbumPayload()

      const newAlbum1 = await albumService.createOne(creationPayload1)
      await albumService.createOne(creationPayload2)

      await requestRepository.updateOne(
        { entity: newAlbum1.id },
        { status: RequestStatusEnum.Approved },
      )

      const filter: IGetAllAlbumsFilter = { status: RequestStatusEnum.Approved }
      const albums = await albumService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(albums).toHaveLength(1)
    })

    it('by rejected status', async () => {
      const creationPayload1 = fakeServiceAlbumPayload()
      const creationPayload2 = fakeServiceAlbumPayload()

      const newAlbum1 = await albumService.createOne(creationPayload1)
      await albumService.createOne(creationPayload2)

      await requestRepository.updateOne(
        { entity: newAlbum1.id },
        { status: RequestStatusEnum.Rejected },
      )

      const filter: IGetAllAlbumsFilter = { status: RequestStatusEnum.Rejected }
      const albums = await albumService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(albums).toHaveLength(1)
    })

    it('if albums do not have requests', async () => {
      const creationPayload1 = fakeRepoAlbumPayload()
      const creationPayload2 = fakeRepoAlbumPayload()

      await albumRepository.createOne(creationPayload1)
      await albumRepository.createOne(creationPayload2)

      const filter = {}
      const albums = await albumService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(albums).toHaveLength(0)
    })
  })

  describe('Get one album by id', () => {
    let getOneByIdSpy: jest.SpyInstance

    beforeEach(() => {
      getOneByIdSpy = jest.spyOn(albumService, 'getOneById')
    })

    it('which exists', async () => {
      const creationPayload = fakeServiceAlbumPayload()
      const newAlbum = await albumService.createOne(creationPayload)

      const album = await albumService.getOneById(newAlbum.id)

      expect(getOneByIdSpy).toBeCalledTimes(1)
      expect(getOneByIdSpy).toBeCalledWith(newAlbum.id)
      expect(album).toBeTruthy()
    })

    it('which not exists', async () => {
      const fakeId = fakeEntityId()

      try {
        const album = await albumService.getOneById(fakeId)
        expect(album).not.toBeTruthy()
      } catch (error) {
        expect(getOneByIdSpy).toBeCalledTimes(1)
        expect(getOneByIdSpy).toBeCalledWith(fakeId)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })
  })

  describe('Delete one album by id', () => {
    let deleteOneByIdSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneByIdSpy = jest.spyOn(albumService, 'deleteOneById')
    })

    it('which exists', async () => {
      const creationPayload = fakeServiceAlbumPayload()
      const newAlbum = await albumService.createOne(creationPayload)

      const deletedAlbum = await albumService.deleteOneById(newAlbum.id)

      expect(deleteOneByIdSpy).toBeCalledTimes(1)
      expect(deleteOneByIdSpy).toBeCalledWith(newAlbum.id)
      expect(deletedAlbum).toBeTruthy()
    })

    it('which not exist and throw not found error', async () => {
      const fakeId = fakeEntityId()

      try {
        const deletedAlbum = await albumService.deleteOneById(fakeId)
        expect(deletedAlbum).not.toBeTruthy()
      } catch (error) {
        expect(deleteOneByIdSpy).toBeCalledTimes(1)
        expect(deleteOneByIdSpy).toBeCalledWith(fakeId)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })

    it('request of album was successfully deleted', async () => {
      const creationPayload = fakeServiceAlbumPayload()
      const newAlbum = await albumService.createOne(creationPayload)

      const deletedAlbum = await albumService.deleteOneById(newAlbum.id)

      try {
        const request = await requestRepository.findOne({
          entity: deletedAlbum.id,
        })

        expect(request).not.toBeTruthy()
      } catch (error) {
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })

    it('tracks of album were successfully deleted', async () => {
      const creationPayload = fakeServiceAlbumPayload()
      const newAlbum = await albumService.createOne(creationPayload)

      await trackService.createOne(
        fakeServiceTrackPayload({ album: newAlbum.id }),
      )

      const deletedAlbum = await albumService.deleteOneById(newAlbum.id)

      const tracks = await trackRepository.findAllWhere({
        albumId: deletedAlbum.id,
      })

      expect(tracks).toHaveLength(0)
    })
  })

  describe('Delete many albums', () => {
    let deleteManySpy: jest.SpyInstance
    let newAlbum1: IAlbumDocument
    let newAlbum2: IAlbumDocument

    beforeEach(async () => {
      deleteManySpy = jest.spyOn(albumService, 'deleteMany')

      newAlbum1 = await albumService.createOne(fakeServiceAlbumPayload())
      newAlbum2 = await albumService.createOne(fakeServiceAlbumPayload())
    })

    it('with empty filter', async () => {
      const filter = {}

      try {
        const deletionResult = await albumService.deleteMany(filter)
        expect(deletionResult).not.toBeTruthy()
      } catch (error: any) {
        expect(deleteManySpy).toBeCalledTimes(1)
        expect(deleteManySpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(AppValidationError)
        expect(error.message).toBe(EMPTY_FILTER_ERR_MSG)
      }
    })

    it('by albums which exists', async () => {
      const filter: IDeleteManyAlbumsFilter = {
        albums: [newAlbum1],
      }

      const deletionResult = await albumService.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(1)
    })

    it('requests of albums were successfully deleted', async () => {
      const filter: IDeleteManyAlbumsFilter = { albums: [newAlbum1, newAlbum2] }
      await albumService.deleteMany(filter)

      const requests = await requestRepository.findAllWhere({
        entityIds: [newAlbum1.id, newAlbum2.id],
      })

      expect(requests).toHaveLength(0)
    })

    it('tracks of album were successfully deleted', async () => {
      await trackService.createOne(
        fakeServiceTrackPayload({ album: newAlbum1.id }),
      )

      const filter: IDeleteManyAlbumsFilter = { albums: [newAlbum1] }
      await albumService.deleteMany(filter)

      const tracks = await trackRepository.findAllWhere({
        albumId: newAlbum1.id,
      })

      expect(tracks).toHaveLength(0)
    })
  })
})
