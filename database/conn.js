const mongoose = require('mongoose')
const link = 'mongodb://127.0.0.1:27017/mernProject'
const link2 = 'mongodb+srv://JayuPatel:mernpassmongo@cluster1.hvuu6u9.mongodb.net/mernProject'
mongoose.connect(link2)

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