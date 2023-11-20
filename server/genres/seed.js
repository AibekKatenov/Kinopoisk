const genres = require('./genres')
const data = [
    'Комедии',
    'Мультфильмы',
    'Ужасы',
    'Фантастика',
    'Триллеры',
    'Боевики',
    'Мелодрамы',
    'Детективы',
    'Приключения',
    'Фэнтези',
] 

async function writeDataGenre(){
    const length = await genres.count();
    if(length==0){
        data.map((item, index) => {
            new genre({
                name: item,
                key: index
            }).save()
        })
    }
}

module.exports = writeDataGenre