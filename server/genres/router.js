const express = require('express')
const router = express.Router()
const {getAllGenres} = require('./controller')
const Genres = require('./genres')
const writeDataGenre = require('./seed')

router.get('/api/genre', getAllGenres)

writeDataGenre()


module.exports = router