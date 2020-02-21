const dotenv = require('dotenv')
dotenv.config()
const mongodb = require('mongodb') // monogodb npm to create connection  

mongodb.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true }, function(err, client){ // create connection with database
    module.exports = client.db() //returns database object
    const app = require('./app') // require app.js file in order to use app variable
    app.listen(process.env.PORT) // starts listen incoming request right after established db connection 
})