const mongoose = require('mongoose')
const link = process.env.LINK
mongoose.connect(link)

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String,
    mobile: String,
    address: String,
    profile: String,
})
module.exports = mongoose.model('User',userSchema)
