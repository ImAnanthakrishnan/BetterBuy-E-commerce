const Category = require('../model/categoryModel');
const User = require('../model/userModel');
const Product = require('../model/productModel');
const loadHome = async(req,res)=>{
   
    try{
        let log = req.session.user_id;
        if(log){
            const userData = await User.findOne({_id:log});
            console.log('helo')
            const product1  = await Product.find().sort({_id:-1}).limit(4).lean().exec();
         if(req.query.item){
        console.log(req.query.item);
           var search = '';
           if(req.query.item){
               search = req.query.item;
           }
      
    
         const product = await Product.find({
            $or:[
                {name:{$regex:'.*'+search+'.*',$options:'i'}}
            ]
         })
    
          console.log(product)
               const response = {
                   product
               };
               res.status(200).json(response); 
            }else{
                res.render('user/home',{title:'home',style:'style.css',user:true,log,data:userData.fname,product1})
            }
        }else{
            const product1  = await Product.find().sort({_id:-1}).limit(4).lean().exec();
            res.render('user/home',{title:'home',style:'style.css',user:true,product1})
        }
    


        
    }
    catch(err){
        console.log(err.message)
    }
}

module.exports={loadHome};