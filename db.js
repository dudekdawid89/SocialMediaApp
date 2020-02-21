const mongodb = require('mongodb') // monogodb npm to create connection  


const connectionString = "mongodb+srv://doToAppUser:vIgekbJFvL4NoWfF@cluster0-1xgrp.mongodb.net/ComplexApp?retryWrites=true&w=majority"

mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true }, function(err, client){ // create connection with database
    module.exports = client.db() //returns database object
    const app = require('./app') // require app.js file in order to use app variable
    app.listen(3000) // starts listen incoming request right after established db connection 
})