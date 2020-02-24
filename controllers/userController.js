const User = require('../models/User')

exports.login = function(req, res){
    let user = new User(req.body)
    user.login().then(function(result){
        req.session.user = {favColor: "red", username: user.data.username}
        req.session.save(function(){ // manually save the session again in order to create callback function to achieve asynchronous operation
            res.redirect('/')
        })
    }).catch(function(e){
        res.send(e)
    })
}

exports.logout = function(req, res){
    req.session.destroy(function(){ // this code delete current session data
        res.redirect('/')
    })
    
}

exports.register = function(req, res){
    console.log(req.body)
    let user = new User(req.body)
    user.register()
    if(user.errors.length){
        res.send(user.errors)
    } else{
        res.send('Congrats, there are no errors.')
    }   
}

exports.home = function(req, res){
    if(req.session.user){
        res.render('home-dashboard', {username: req.session.user.username})

    } else{
        res.render('home-guest') 
    }
}