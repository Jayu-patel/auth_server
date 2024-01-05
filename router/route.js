const express = require('express')
const router = express.Router()
const contoller = require('../controllers/appControllers')
const mail = require('../controllers/mail')
const localFile = require('../middleware/auth')

//POST
router.route('/register').post(contoller.register)
router.route('/auth').post(contoller.verifyUser,(_,res)=> res.status(201).json({data: "all set"}))
router.route('/login').post(contoller.verifyUser,contoller.login)
router.route('/getMail').post(mail.registerMail)

//GET
router.route('/user/:username').get(contoller.getUser)
router.route('/otp').get(contoller.verifyUser,localFile.localVar,contoller.generateOTP)
router.route('/verifyOtp').get(contoller.verifyUser,contoller.verifyOTP)
router.route('/session').get(contoller.createResetSession)

//PUT
router.route('/updateUser').put(localFile.auth,contoller.updateUser)
router.route('/resetPassword').put(contoller.verifyUser,contoller.resetPass)


module.exports = router