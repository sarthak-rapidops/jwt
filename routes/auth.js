const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const router = express.Router()
const User = require('../module/user')
const {registerValidation, loginValidation} = require('../validation')
//validation

dotenv.config()
router.post('/register',async (req, res)=> {
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //checking the user is already in the database
    const emailEixst = await User.findOne({email: req.body.email})
    if(emailEixst) return res.status(400).send("email is alreadt exists")
    
    // hash the passowrd
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password,salt)


    // create a new user
    const user = new User ({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    try{
        const saveUser = await user.save()
        res.send({user: user._id})
    }catch(err) {
        res.status(400).send(err)
    }
})

//login
router.post('/login', async(req, res)=>{
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)  
    // email is exists
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send("email or password is wrong") 
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send("email or password is wrong") 

    //create and assign token 
    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET)
    console.log(token)
    res.header('auth-token', token).send(token)
    res. send("logged in")

})

module.exports = router