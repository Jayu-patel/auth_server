const model = require('../database/conn')
const bcrypt = require('bcrypt')
const Jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
require('dotenv').config()

const verifyUser=async(req,res,next)=>{
    try{

        const {username} = req.method == "GET" ? req.query : req.body

        const exist = await model.findOne({username})
        if(!exist) return res.status(404).json({error: "User not found"})
        next()
    }
    catch(e){
        res.status(404).json({error: "error"})
    }
}

const register=async(req,res)=>{
    const {username, email, password, profile} = req.body
    if(email && username && password){
        let user = await model.findOne({username}).select('-password')
        let mail = await model.findOne({email}).select('-password')
        if(user || mail){
            return res.status(403).send("User already exist, please try with new username and email")
        }
        else{
            const hashPass = await bcrypt.hash(password,10)
            const user = new model({
                username,
                password: hashPass,
                email,
                profile: profile || ''
            })
            const result = await user.save()
            if(result) res.status(201).json({msg: 'Your profile is registered succesfully'})
            else res.status(500).json({error: 'somthing went wrong'})
        }
    }
    else{
        res.status(501).json({error: "please provide all details"})
    }

}

const login=async(req,res)=>{
    const {username, password} = req.body
    if(username && password){
        const user = await model.findOne({username})
        const isSame = await bcrypt.compare(password, user.password)
        
        if(!isSame) return res.status(400).json({error: "Password does not match"})
        else{
            const token = Jwt.sign({
                userId: user._id,
                username: user.username
            }, process.env.KEY , {expiresIn: "12h"})

            return res.status(201).json({
                msg: "Login successful...",
                username: user.username, 
                token
            })
        }
    }
    else{
        res.status(500).json({error: "please provide all details"})
    }
}

const getUser=async(req,res)=>{
    const {username} = req.params

    if(!username) return res.status(500).json({error: "invalid username"})
    else{
        const user = await model.findOne({username}).select('-password')
        if(!user)
            return res.status(404).json({error: "User not found"})
        
            return res.status(201).json(user)
        
    }
}

const updateUser=async(req,res)=>{
    try{
        // const id = req.query.id
        const {userId} = req.user

        if(userId){
            const result = await model.updateOne({_id: userId}, req.body)
            if(result) return res.status(201).json({msg: "User updated...!"})
        }
        else return res.status(401).send({error: "User not found...!"})
    }
    catch(error){
        return res.status(401).send({error})
    }
}

const generateOTP=async(req,res)=>{
    req.app.locals.OTP = await otpGenerator.generate(6,{
        lowerCaseAlphabets: false, 
        upperCaseAlphabets: false, 
        specialChars: false
    })
    res.status(201).json({code: req.app.locals.OTP})
}

const verifyOTP=(req,res)=>{
    const {code} = req.query
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null
        req.app.locals.resetSession = true
        return res.status(201).json({msg: 'verify successfully'})
    }
    return res.status(400).json({error: "Invalid OTP"})
}

const createResetSession=(req,res)=>{
    if(req.app.locals.resetSession){
        req.app.locals.resetSession = false
        return res.status(201).json({msg: "access granted"})
    }
    return res.status(440).json({error: "Session expired"})
}

const resetPass=async(req,res)=>{

    if(!req.app.locals.resetSession) return res.status(440).json({error: "Session expired"})

    const {username, password} = req.body
    if(username && password){
        const user = await model.findOne({username})
        if(!user){
            return res.status(404).json({error: "user not found"})
        }

        const hashPass = await bcrypt.hash(password,10)
        const updatedUser = await model.updateOne({username: user.username}, {password: hashPass})
        if(updatedUser)
            return res.status(201).json({msg: "Record updated"})
    }
    else{
        return res.status(500).json({error: "Please provide proper username and password"})
    }

}

module.exports = {
    verifyUser,
    register,
    login,
    getUser,
    updateUser,
    generateOTP,
    verifyOTP,
    createResetSession,
    resetPass
}