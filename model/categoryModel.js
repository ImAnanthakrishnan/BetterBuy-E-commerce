const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    is_disabled:{
        type:Boolean,
       default:false
    }
});
const Category = mongoose.model("Category",categorySchema)
module.exports = Category;