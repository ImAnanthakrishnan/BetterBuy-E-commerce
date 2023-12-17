const mongoose = require('mongoose');
const otpSchema = new mongoose.Schema({
    userId : {
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    expiresAt:{
        type:Date,
        required:true
    }
})

module.exports = mongoose.model('userOtpVerification',otpSchema)
