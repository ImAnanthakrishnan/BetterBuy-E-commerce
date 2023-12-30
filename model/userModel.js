const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    is_admin:{
        type:Number,
        required:true
    },
    referalCode:{
        type:String,
        required:true
    },
    refferedCode:{
        type:String
    },
    is_verified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:''
    },
    is_blocked:{
        type:Boolean,
        default:false
    },
    is_reffered:{
        type:Boolean,
        default:false
    }

});

const User = mongoose.model('User',userSchema)
module.exports=User;