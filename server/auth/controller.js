const User = require('./user')
const bcrypt = require('bcrypt')

const signup = async(req, res) => {
    if(req.body.email.length <= 0 && req.body.full_name.length <= 0 && 
        req.body.password.length <= 0 && req.body.repassword.length <= 0
        ){
            res.redirect('/register?error=1')
        }else if(req.body.password !== req.body.repassword){
            res.redirect('/register?error=2')
        }
    const findUser = await User.findOne({email: req.body.email}).count()
    if(findUser){
        res.redirect('/register?error=3')
    } 
    bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                new User({
                    email: req.body.email,
                    full_name: req.body.full_name,
                    password: hash,
                    isAdmin: false
                }).save()
                res.redirect('/login')
            });
        })
  
}

const signIn = (req,res) => {
    if(req.user.isAdmin){
        res.redirect(`/admin/${req.user._id}`)
    }else{
    res.redirect(`/profile/${req.user._id}`)
    }
}

const signout = (req,res) => {
    req.logout(function(err){
        if(err){
            console.log(err)
        }
        res.redirect('/')
    })
}
module.exports = {signup, signIn,signout}