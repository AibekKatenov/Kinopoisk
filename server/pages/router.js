const express = require('express')
const router = express.Router()
const genres = require('../genres/genres')
const country = require('../country/country')
const User = require('../auth/user')
const Film = require('../films/film')
const Rate = require('../rates/rates')


router.get('/', async(req, res) => {
    const options = {}
    const Genres = await genres.findOne({key : req.query.genre}) 
    if(Genres){
        options.genre = Genres._id
        res.locals.genre = req.query.genre
    }
    let page = 0
    const limit = 3
    if(req.query.page && req.query.page > 0){
        page = req.query.page
    }
    if(req.query.search && req.query.search.length > 0){
        options.$or = [
            {
                titleRus: new RegExp(req.query.search, 'i')
            },
            {
                titleEng: new RegExp(req.query.search, 'i')
            }
        ]
        res.locals.search = req.query.search
    }

    const totalFilms = await Film.count(options)
    const allGenres = await genres.find()
    const films = await Film.find(options).limit(limit).skip(page * limit).populate('country').populate('genre')
    const user = req.user ? await User.findById(req.user._id) : {}
    res.render('index', {genres: allGenres, user, films: films, pages : Math.ceil(totalFilms / limit)})
})
router.get('/login', (req,res) => {
    res.render('login', {user: req.user ? req.user : {}})
})

router.get('/register', (req,res) => {
    res.render('register', {user: req.user ? req.user : {}})
})

router.get('/profile/:id', async(req,res) => {
    const allGenres = await genres.find();
    const user = await User.findById(req.params.id).populate('toWatch')
    .populate({path: 'toWatch', populate: {path: 'country'}})
    .populate({path: 'toWatch', populate: {path: 'genre'}})
    if(user){
        res.render('profile', {user: user, genres: allGenres, loginUser: req.user})
    }else{
        res.redirect('/not-found')
    }
})

router.get('/admin/:id', async(req,res) => {
    const allGenres = await genres.find()
    const user = await User.findById(req.params.id)
    const films = await Film.find().populate('country').populate('genre').populate('author')
    res.render('adminProfile', {user: req.user ? req.user : {}, genres: allGenres, films: films})
})

router.get('/new', async(req,res) => {
    const allGenres = await genres.find();
    const allCountries = await country.find();
    res.render('newFilm', {genres: allGenres, country: allCountries, user: req.user ? req.user : {}})
})

router.get('/edit/:id', async(req,res) => {
    const allGenres = await genres.find();
    const allCountries = await country.find();
    const film = await Film.findById(req.params.id)
    res.render('editFilm', {genres: allGenres, country: allCountries, user: req.user ? req.user : {}, film: film})
})

router.get('/not-found', (req,res) => {
    res.render('notFound')
})

router.get('/detail/:id', async(req, res) => {
    const rates = await Rate.find({filmId: req.params.id}).populate('authorId')
    let averageRate = 0
    for(let i=0;i<rates.length;i++){
        averageRate += rates[i ].rate
    } 
    const film = await Film.findById(req.params.id).populate('country').populate('genre')
    res.render('detail', {user: req.user ? req.user : {}, film: film, rates: rates, averageRate: (averageRate/rates.length).toFixed(1)})
})


module.exports = router  