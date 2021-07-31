import express from 'express'

import { makeRoutePath } from 'configs/app'

import ArtistModel from '../model/artist.model'

const router = express.Router()

export const artistRoutePath = makeRoutePath('artists')

router.get('/', (req, res) => {
  res.send('all artists')
})

router.post('/', async (req, res) => {
  const artist = new ArtistModel({
    name: 'Petr',
    photo: 'image source',
  })

  const savedArtist = await artist.save()

  res.send(savedArtist)
})

export default router
