const user = require('../auth/user')
const bcrypt = require('bcrypt')

async function createAdmin(){
    const findAdmin = await user.find({isAdmin: true}).count()
    if(findAdmin == 0){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash('1', salt, function(err, hash) {
                new user({
                        full_name: 'Master',
                        email: 'master@mail.ru',
                        password: hash,
                        isAdmin: true,
                    }).save()
                })
            })
    }
}

module.exports = createAdmin