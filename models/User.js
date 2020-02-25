const userCollection = require('../db').db().collection('users') // required database object and looked inside for collection -users-
const validator = require('validator')
const bcrypt = require('bcryptjs')
const md5 = require('md5')

let User = function(data){
    console.log('data :', data);
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
        if(attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password )){ // compare bcrypt password on database with user password
            this.data = attemptedUser
            this.getAvatar()
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
    return new Promise(async(resolve, reject) => {
        if(this.data.username == ""){this.errors.push("You must provide a username")}
        if(this.data.username != "" && !validator.isAlphanumeric(this.data.username)){this.errors.push('Username can only constains letters and numbers')}
        if(!validator.isEmail(this.data.email)){this.errors.push("You must provide a email")}
        if(this.data.password == ""){this.errors.push("You must provide a password")}
        if(this.data.password.length > 0 && this.data.password.length < 12){this.errors.push('Password must be at least 12 characters long')}
        if(this.data.password.length > 50){this.errors.push('Password can not exceed 50 characters')} // password set to 50 character because of bcrypt limit of characters
        if(this.data.username.length > 0 && this.data.username.length < 3){
            console.log('this.data.username.length :', this.data.username.length);
            this.errors.push('Username must be at least 3 characters long')}
        if(this.data.username.length > 30){this.errors.push('Username can not exceed 30 characters')}
    
        // Only if username is valid then check to see if it's already taken
        if(this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)){
            let usernameExists = await userCollection.findOne({username: this.data.username})
            if(usernameExists) {this.errors.push('That username is already taken')}
        }
    
            // Only if email is valid then check to see if it's already taken
        if(validator.isEmail(this.data.email)){
            let emailExists = await userCollection.findOne({email: this.data.email})
            if(emailExists) {this.errors.push('That email is already taken')}
        }
        resolve()
    })
}


User.prototype.register = function(){
    return new Promise(async (resolve, reject) =>{
        // Step #1: Validatae user data
        this.cleanUp()
        await this.validate()
        // Step #2: Only if there are no validation errprs then save the user data into a database
        console.log(this.data)
        if(!this.errors.length){
            // hash user password
        let salt = bcrypt.genSaltSync(10)
        this.data.password = bcrypt.hashSync(this.data.password, salt)
            await userCollection.insertOne(this.data)
            this.getAvatar()
            resolve()
        } else {
            reject(this.errors)

        }
    })
}

User.prototype.getAvatar = function(){
    this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
}
module.exports = User