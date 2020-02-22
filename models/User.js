const userCollection = require('../db').collection('users') // required database object and looked inside for collection -users-

const validator = require('validator')
let User = function(data){
    this.data = data
    this.errors = []
}

User.prototype.cleanUp = function(){
    if(typeof(this.data.username)!= "string"){ this.data.username = ""}
    if(typeof(this.data.email )!= "string"){ this.data.email = ""}
    if(typeof(this.data.password )!= "string"){ this.data.password = ""}

    // get rid of any bogus properties
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.login = function(){
    return new Promise((resolve, reject) => {
        this.cleanUp()
    userCollection.findOne({username: this.data.username}).then((attemptedUser) => {
        if(attemptedUser && attemptedUser.password == this.data.password){
            resolve('Congrats')
        } else {
            reject("Invalid username / password")
        }
    }).catch(function(){
        reject("Please try again later")
    })
        
    })
}

User.prototype.validate = function(){
    if(this.data.username == ""){this.errors.push("You must provide a username")}
    if(this.data.username != "" && !validator.isAlphanumeric(this.data.username)){this.errors.push('Username can only constains letters and numbers')}
    if(!validator.isEmail(this.data.email)){this.errors.push("You must provide a email")}
    if(this.data.password == ""){this.errors.push("You must provide a password")}
    if(this.data.password.length > 0 && this.data.password.length < 12){this.errors.push('Password must be at least 12 characters long')}
    if(this.data.password.length > 100){this.errors.push('Password can not exceed 100 characters')}
    if(this.data.username.length > 0 && this.data.password.length < 3){this.errors.push('Username must be at least 3 characters long')}
    if(this.data.username.length > 30){this.errors.push('Username can not exceed 30 characters')}
}

User.prototype.register = function(){
    // Step #1: Validatae user data
    this.cleanUp()
    this.validate()


    // Step #2: Only if there are no validation errprs then save the user data into a database
    console.log(this.data)
    if(!this.errors.length){
        userCollection.insertOne(this.data)
    }
}


module.exports = User