const express = require('express')
    const passport = require('passport')
const router = express.Router()
const {signup,signIn,signout} = require('./controller')
const createAdmin = require('../admin/seed')


router.post('/api/signup', signup)
router.post('/api/signin', passport.authenticate('local', {failureRedirect: '/login?error=1'}), signIn)
router.get('/api/signout', signout)
router.get('/api/auth/google', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile/' + req.user.id)
})
createAdmin()

module.exports = router 