import { container as DiContainer } from 'tsyringe'

import { fakeServiceAlbumPayload } from '__tests__/fakeData/album'
import {
  fakeRepoArtistPayload,
  fakeServiceArtistPayload,
} from '__tests__/fakeData/artist'
import { fakeEntityId } from '__tests__/utils'
import {
  AppNotFoundError,
  AppValidationError,
} from 'app/utils/errors/appErrors'
import { DatabaseNotFoundError } from 'database/errors'
import * as db from 'database/utils/db'
import { registerModel } from 'database/utils/registerModels'
import { DiTokenEnum } from 'lib/dependency-injection'
import { AlbumRepository } from 'modules/album/repository'
import { AlbumService } from 'modules/album/service'
import { ArtistRepository } from 'modules/artist/repository'
import { ArtistService, IGetAllArtistsFilter } from 'modules/artist/service'
import { RequestStatusEnum } from 'modules/request/constants'
import { RequestRepository } from 'modules/request/repository'

let artistService: ArtistService
let artistRepository: ArtistRepository

let albumService: AlbumService
let albumRepository: AlbumRepository

let requestRepository: RequestRepository

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  registerModel(DiTokenEnum.Artist)
  registerModel(DiTokenEnum.Album)
  registerModel(DiTokenEnum.Request)

  artistService = DiContainer.resolve(ArtistService)
  artistRepository = DiContainer.resolve(ArtistRepository)

  albumService = DiContainer.resolve(AlbumService)
  albumRepository = DiContainer.resolve(AlbumRepository)

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

describe('Artist service', () => {
  describe('Create one artist', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(artistService, 'createOne')
    })

    it('with correct data created successfully', async () => {
      const creationPayload = fakeServiceArtistPayload()
      const newArtist = await artistService.createOne(creationPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(creationPayload)
      expect(newArtist).toBeTruthy()
    })

    it('with correct data request successfully created for new artist', async () => {
      const creationPayload = fakeServiceArtistPayload()
      const newArtist = await artistService.createOne(creationPayload)

      const request = await requestRepository.findOne({
        entity: newArtist.id,
      })

      expect(request.entity.id).toBe(newArtist.id)
    })

    it('with incorrect data throw validation error', async () => {
      const creationPayload = fakeServiceArtistPayload({
        isIncorrect: true,
      })

      try {
        const newArtist = await artistService.createOne(creationPayload)
        expect(newArtist).not.toBeTruthy()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(creationPayload)
        expect(error).toBeInstanceOf(AppValidationError)
      }
    })
  })

  describe('Update one artist by id', () => {
    let updateOneByIdSpy: jest.SpyInstance

    beforeEach(() => {
      updateOneByIdSpy = jest.spyOn(artistService, 'updateOneById')
    })

    it('with correct data updated successfully', async () => {
      const creationPayload = fakeServiceArtistPayload()
      const newArtist = await artistService.createOne(creationPayload)

      const artistUpdates = fakeServiceArtistPayload()
      const updatedArtist = await artistService.updateOneById(
        newArtist.id,
        artistUpdates,
      )

      expect(updateOneByIdSpy).toBeCalledTimes(1)
      expect(updateOneByIdSpy).toBeCalledWith(newArtist.id, artistUpdates)
      expect(updatedArtist).toBeTruthy()
    })

    it('with incorrect data throw validation error', async () => {
      const creationPayload = fakeServiceArtistPayload()
      const newArtist = await artistService.createOne(creationPayload)

      const artistUpdates = fakeServiceArtistPayload({ isIncorrect: true })

      try {
        const updatedArtist = await artistService.updateOneById(
          newArtist.id,
          artistUpdates,
        )

        expect(updatedArtist).not.toBeTruthy()
      } catch (error) {
        expect(updateOneByIdSpy).toBeCalledTimes(1)
        expect(updateOneByIdSpy).toBeCalledWith(newArtist.id, artistUpdates)
        expect(error).toBeInstanceOf(AppValidationError)
      }
    })

    it('which not exist and throw not found error', async () => {
      const artistId = fakeEntityId()
      const artistUpdates = fakeServiceArtistPayload()

      try {
        const updatedArtist = await artistService.updateOneById(
          artistId,
          artistUpdates,
        )

        expect(updatedArtist).not.toBeTruthy()
      } catch (error) {
        expect(updateOneByIdSpy).toBeCalledTimes(1)
        expect(updateOneByIdSpy).toBeCalledWith(artistId, artistUpdates)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })
  })

  describe('Get all artists', () => {
    let getAllSpy: jest.SpyInstance

    beforeEach(() => {
      getAllSpy = jest.spyOn(artistService, 'getAll')
    })

    it('with empty filter', async () => {
      const creationPayload1 = fakeServiceArtistPayload()
      const creationPayload2 = fakeServiceArtistPayload()

      await artistService.createOne(creationPayload1)
      await artistService.createOne(creationPayload2)

      const filter = {}
      const artists = await artistService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(artists).toHaveLength(2)
    })

    it('by user which has artists', async () => {
      const creationPayload1 = fakeServiceArtistPayload()
      const creationPayload2 = fakeServiceArtistPayload()

      await artistService.createOne(creationPayload1)
      await artistService.createOne(creationPayload2)

      const filter: IGetAllArtistsFilter = {
        userId: creationPayload1.user,
      }

      const artists = await artistService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(artists).toHaveLength(1)
    })

    it('by user which does not have artists', async () => {
      const creationPayload = fakeServiceArtistPayload()
      await artistService.createOne(creationPayload)

      const filter: IGetAllArtistsFilter = {
        userId: fakeEntityId(),
      }

      const artists = await artistService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(artists).toHaveLength(0)
    })

    it('by pending status', async () => {
      const creationPayload1 = fakeServiceArtistPayload()
      const creationPayload2 = fakeServiceArtistPayload()

      const newArtist1 = await artistService.createOne(creationPayload1)
      await artistService.createOne(creationPayload2)

      await requestRepository.updateOne(
        { entity: newArtist1.id },
        { status: RequestStatusEnum.Approved },
      )

      const filter: IGetAllArtistsFilter = { status: RequestStatusEnum.Pending }
      const artists = await artistService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(artists).toHaveLength(1)
    })

    it('by approved status', async () => {
      const creationPayload1 = fakeServiceArtistPayload()
      const creationPayload2 = fakeServiceArtistPayload()

      const newArtist1 = await artistService.createOne(creationPayload1)
      await artistService.createOne(creationPayload2)

      await requestRepository.updateOne(
        { entity: newArtist1.id },
        { status: RequestStatusEnum.Approved },
      )

      const filter: IGetAllArtistsFilter = {
        status: RequestStatusEnum.Approved,
      }
      const artists = await artistService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(artists).toHaveLength(1)
    })

    it('by rejected status', async () => {
      const creationPayload1 = fakeServiceArtistPayload()
      const creationPayload2 = fakeServiceArtistPayload()

      const newArtist1 = await artistService.createOne(creationPayload1)
      await artistService.createOne(creationPayload2)

      await requestRepository.updateOne(
        { entity: newArtist1.id },
        { status: RequestStatusEnum.Rejected },
      )

      const filter: IGetAllArtistsFilter = {
        status: RequestStatusEnum.Rejected,
      }
      const artists = await artistService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(artists).toHaveLength(1)
    })

    it('if artists do not have requests', async () => {
      const creationPayload1 = fakeRepoArtistPayload()
      const creationPayload2 = fakeRepoArtistPayload()

      await artistRepository.createOne(creationPayload1)
      await artistRepository.createOne(creationPayload2)

      const filter = {}
      const artists = await artistService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(artists).toHaveLength(0)
    })
  })

  describe('Get one artist by id', () => {
    let getOneByIdSpy: jest.SpyInstance

    beforeEach(() => {
      getOneByIdSpy = jest.spyOn(artistService, 'getOneById')
    })

    it('which exists', async () => {
      const creationPayload = fakeServiceArtistPayload()
      const newArtist = await artistService.createOne(creationPayload)

      const artist = await artistService.getOneById(newArtist.id)

      expect(getOneByIdSpy).toBeCalledTimes(1)
      expect(getOneByIdSpy).toBeCalledWith(newArtist.id)
      expect(artist).toBeTruthy()
    })

    it('which not exists', async () => {
      const fakeId = fakeEntityId()

      try {
        const artist = await artistService.getOneById(fakeId)
        expect(artist).not.toBeTruthy()
      } catch (error) {
        expect(getOneByIdSpy).toBeCalledTimes(1)
        expect(getOneByIdSpy).toBeCalledWith(fakeId)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })
  })

  describe('Delete one artist by id', () => {
    let deleteOneByIdSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneByIdSpy = jest.spyOn(artistService, 'deleteOneById')
    })

    it('which exists', async () => {
      const creationPayload = fakeServiceArtistPayload()
      const newArtist = await artistService.createOne(creationPayload)

      const deletedArtist = await artistService.deleteOneById(newArtist.id)

      expect(deleteOneByIdSpy).toBeCalledTimes(1)
      expect(deleteOneByIdSpy).toBeCalledWith(newArtist.id)
      expect(deletedArtist).toBeTruthy()
    })

    it('which does not exist and throw not found error', async () => {
      const fakeId = fakeEntityId()

      try {
        const deletedArtist = await artistService.deleteOneById(fakeId)
        expect(deletedArtist).not.toBeTruthy()
      } catch (error) {
        expect(deleteOneByIdSpy).toBeCalledTimes(1)
        expect(deleteOneByIdSpy).toBeCalledWith(fakeId)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })

    it('request of artist was successfully deleted', async () => {
      const creationPayload = fakeServiceArtistPayload()
      const newArtist = await artistService.createOne(creationPayload)

      const deletedArtist = await artistService.deleteOneById(newArtist.id)

      try {
        const request = await requestRepository.findOne({
          entity: deletedArtist.id,
        })

        expect(request).not.toBeTruthy()
      } catch (error) {
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })

    it('albums of artist were successfully deleted', async () => {
      const creationPayload = fakeServiceArtistPayload()
      const newArtist = await artistService.createOne(creationPayload)

      await albumService.createOne(
        fakeServiceAlbumPayload({ artist: newArtist.id }),
      )

      const deletedArtist = await artistService.deleteOneById(newArtist.id)

      const albums = await albumRepository.findAllWhere({
        artist: deletedArtist.id,
      })

      expect(albums).toHaveLength(0)
    })
  })
})
