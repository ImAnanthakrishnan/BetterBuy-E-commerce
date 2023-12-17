const Category = require('../model/categoryModel')
const loadGrocery = async(req,res)=>{
    try{
        let log = req.session.user_id;
       const cat_data = await Category.find().lean()
        res.render('user/groceries',{title:'groceries',style:'style.css',user:true,cat_data,log})
    }
    catch(err){
        throw new Error(err)
    }
}

module.exports={loadGrocery};