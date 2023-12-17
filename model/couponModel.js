const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    discount:{
        type:Number,
        required:true
    },
    expiry:{
        type:Date,
        required:true
    },
    purchase_amt:{
        type:Number,
        required:true
    },
    usedBy: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Coupon',couponSchema);