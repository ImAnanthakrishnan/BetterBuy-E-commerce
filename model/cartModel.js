const mongoose = require('mongoose');
//const Product = require('./productModel');
//const User = require('./userModel');
const cartSchema = mongoose.Schema({
    userId : {
        type:String,
        required:true
    },
   product:[{
     productId:{
        type:mongoose.Types.ObjectId,
        ref:'Product',
        required:true
    },
    name:{
      type:String,
      required:true
    },
      price:{
        type:Number,
        required:true
      },
      quantity:{
        type:Number,
        required:true
      }
   }],
   totalPrice:{
    type:Number,
    default:0
   }
});
module.exports = mongoose.model('Cart',cartSchema);