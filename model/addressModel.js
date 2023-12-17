const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
   address:[{
    address:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    }
  
   }]

});
const Address = mongoose.model('Address',addressSchema);
module.exports = Address;