const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    totalPrice:{
        type:Number,
        default:0
    },
 
});

module.exports = mongoose.model('Wallet',walletSchema);