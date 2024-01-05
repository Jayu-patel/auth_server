const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const router = require('./router/route')
const path = require('path')
const bodyParser = require('body-parser')
const { count } = require('console')
require('dotenv').config()

const link = __dirname
console.log(link)

app.use(cors())
app.use(bodyParser.json({limit: "100mb"}))
app.use(bodyParser.urlencoded({extended: true, parameterLimit: 100000, limit: "100mb"}))
app.use(morgan('tiny'))
app.disable('x-powered-by')

const port = process.env.PORT || 8080

app.get('/',(req,res)=>{
    res.status(200).json('server is started')
})

//apis
app.use('/api',router)

app.listen(port,()=>{
    console.log("server is running")
})