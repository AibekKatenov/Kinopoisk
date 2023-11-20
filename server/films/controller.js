const film = require('./film')
const user = require('../auth/user')
const fs = require('fs')
const path = require('path')


const createFilm = async(req, res) => {
    if(req.file && req.body.titlerus.length > 2 && req.body.titleeng.length > 2
        && req.body.year > 0
        && req.body.time > 2){
            if(req.body.video && req.body.video.length > 2){
                await new film({
                    titleRus: req.body.titlerus,
                    titleEng: req.body.titleeng,
                    year: req.body.year,
                    time: req.body.time,
                    video: req.body.video,
                    country: req.body.country,
                    genre: req.body.genre,
                    image: `/images/films/${req.file.filename}`,
                    author: req.user._id,
                }).save()
            }else if(req.body.series && req.body.series.length > 0){
                await new film({
                    titleRus: req.body.titlerus,
                    titleEng: req.body.titleeng,
                    year: req.body.year,
                    time: req.body.time,
                    series: req.body.series,
                    country: req.body.country,
                    genre: req.body.genre,
                    image: `/images/films/${req.file.filename}`,
                    author: req.user._id,
                }).save()
            }
            res.redirect(`/admin/${req.user._id}`)
    }else{
        res.redirect('/new?error=1')
    }
    console.log(req.body)
}

const editFilm = async(req,res) => {
    if(req.file && req.body.titlerus.length > 0 &&
        req.body.titleeng.length > 0 &&
        req.body.year > 0 && 
        req.body.time > 10 &&
        req.body.country.length > 0 &&
        req.body.genre.length > 0 && 
        req.body.video.length > 2)
        {
            const Film = await film.findById(req.body.id)
            try{
            fs.unlinkSync(path.join(__dirname + '../../../public' + Film.image))
            }catch(e){
            }
            Film.titleRus = req.body.titlerus
            Film.titleEng = req.body.titleeng
            Film.year = req.body.year 
            Film.time = req.body.time
            Film.video = req.body.video  
            Film.country = req.body.country
            Film.genre = req.body.genre 
            Film.image = `/images/films/${req.file.filename}`
            Film.author = req.user._id
            Film.save()
            res.redirect(`/admin/${req.user._id}`)
        }else{
            res.redirect(`/edit/${req.body.id}?error=1`)
        }

}

const deleteFilm = async(req, res) => {
    const Film = await film.findById(req.params.id)
    if(Film){
        fs.unlinkSync(path.join(__dirname + '../../../public' + Film.image))
        await Film.deleteOne({_id: req.params.id})
        res.status(200).send('ok')
    }else{
        res.status(404).send('Not found')    
    }
}

const saveFilm = async(req, res) => {
    if(req.user && req.body.id){
       const User = await user.findById(req.user.id)
       const findFilm = User.toWatch.filter(item => item._id == req.body.id)
       if(findFilm.length == 0){
          User.toWatch.push(req.body.id)
          User.save()
          res.send('Фильм успешно сохранен')
       }else{
          res.send('Фильм уже сохранен')
       }
    }
   
}

const deleteFilmFromToWatch = async(req, res) => {
    if(req.user && req.params.id){
        const User = await user.findById(req.user.id)
        for(let i = 0; i < User.toWatch.length; i++){
            if(User.toWatch[i] == req.params.id){
                User.toWatch.splice(i, 1)
                User.save()
                res.send('Успешно удалено')
            }
        }
    }
}

module.exports = {createFilm, editFilm, deleteFilm, saveFilm, deleteFilmFromToWatch }