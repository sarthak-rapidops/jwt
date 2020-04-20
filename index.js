const express = require('express')
const app = express()
const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')
const mongoose = require('mongoose')
const db = require('./config/key').mongoURI


// connect to mongoDB
mongoose.connect(db,{useNewUrlParser: true})
.then(()=> console.log("Connected to MongoDB"))
.catch(err => console.log(err))

//middlewre
app.use(express.json())

//route middleware
app.use('/api/user',authRoute)
app.use('/api/post',postRoute)
app.listen(3000, ()=> {
    console.log("running on 3000")
})