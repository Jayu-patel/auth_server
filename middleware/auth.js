const Jwt = require('jsonwebtoken')
require('dotenv').config()

const auth=async(req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]

        const decode = await Jwt.verify(token, process.env.KEY)

        req.user = decode
        next()
    }
    catch(err){
        res.status(500).json(err)
    }
}

const localVar =(req,res,next)=>{
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next()
}

module.exports = {
    auth,
    localVar
}