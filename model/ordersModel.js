const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
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
        quantity:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        }
      
    }],
    fullname:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
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
    }],
    paymentMethod:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'Order Placed',
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        immutable:true,
        default:()=>Date.now()
    },
  is_cancelled:{
    type:Boolean,
    default:false,

  },
  is_return:{
    type:Boolean,
    default:false
  }


});

module.exports = mongoose.model('Order',orderSchema);