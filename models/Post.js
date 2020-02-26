const postsCollection = require('../db').db().collection('posts')
const ObjectID = require('mongodb').ObjectID
const User = require('./User')

let Post = function(data, userId){
    this.data = data,
    this.errors = [],
    this.userId = userId
}

Post.prototype.cleanUp = function(){
    if(typeof(this.data.title) != "string"){this.data.title = ""}
    if(typeof(this.data.body) != "string"){this.data.body = ""}
    
    // get rid of any bogus properties
    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        createDate: new Date(),
        author: ObjectID(this.userId)
    }
    console.log('this.data :', this.data);
}
Post.prototype.validate = function(){
    
    if(this.data.title == ""){this.errors.push("You must provide a title")}
    if(this.data.body == ""){this.errors.push("You must provide post content")}
    console.log('this.data.title validate :', this.data.title);
}

Post.prototype.create = function(){
    return new Promise((resolve, reject) =>{
        this.cleanUp()
        this.validate()
        if(!this.errors.length){
            // save post into database
            postsCollection.insertOne(this.data).then(() => {
                console.log('this.data inside create :', this.data);
                resolve()
            }).catch(() => {
                this.errors.push('Please try again later')
                reject(this.errors)
            })
        }else
        reject(this.errors)
    })
}

Post.findSingleById = function(id){
    return new Promise( async function(resolve, reject){
        if(typeof(id) != "string" || !ObjectID.isValid(id)){
            reject()
            return
        }
        let posts = await postsCollection.aggregate([
            {$match: {_id: new ObjectID(id)}},
            {$lookup: {from: "users", localField: "author", foreignField: "_id", as: "authorDocument"}},
            {$project: {
                title: 1,
                body: 1,
                createDate: 1,
                author: {$arrayElemAt: ['$authorDocument', 0]}
            }}
        ]).toArray()

        //clean up author property in each post object
        posts = posts.map(function(post){
            post.author = {
                username: post.author.username,
                avatar: new User(post.author, true).avatar
            }
            return post
        })
        console.log('post :', posts);
        if(posts.length){
            console.log('post[0] :', posts[0]);
            resolve(posts[0])
        }else{
            reject()
        }
    })
}

module.exports = Post