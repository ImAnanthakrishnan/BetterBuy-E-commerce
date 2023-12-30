const mongoose =  require('mongoose');


const Category = require('./categoryModel')

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    quantity : {
        type:Number,
        required:true
    }
    ,
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    images:{
        type:Array,
        required:true,
        validate:[arrayLimit,'You can pass only 3 product images']
    },
    category_id:{
        type:mongoose.Types.ObjectId,
        ref:Category,
        required:true
    },
    earlierPrice:{
      type:Number,
      required:true
    },
    is_disabled:{
        type:Boolean,
       default:false
    },
    is_cancelled:{
        type:Boolean,
        default:false
    }
    ,is_offer:{
        type:Boolean,
        default:false
    }
});

function arrayLimit(val){
    return val.length<=3;
}

const Product = mongoose.model("Product",productSchema);
module.exports = Product;