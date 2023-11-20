const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/kinopoisk').then(() => {
    return console.log("Connected to mongoDB")}).catch((e) => {
        console.log("failed to connect to mongoDB")
    })


