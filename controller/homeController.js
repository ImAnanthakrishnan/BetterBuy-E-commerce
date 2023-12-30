const Category = require('../model/categoryModel');
const User = require('../model/userModel');
const Product = require('../model/productModel');
const Banner = require('../model/bannerModel');
const loadHome = async(req,res)=>{
   
    try{
        let log = req.session.user_id;
        if(log){
            
            const userData = await User.findOne({_id:log});
            console.log('helo')
            const product1  = await Product.find().sort({_id:-1}).limit(4).lean().exec();
            //const banner = await Banner.findOne().lean();
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

                const banner1 = await Banner.findOne({position:'home1'}).lean();
                const banner2 = await Banner.findOne({position:'home2'}).lean();
                const banner3 = await Banner.findOne({position:'home3'}).lean();
               
                if(banner1 && !banner2&&!banner3){
                    res.render('user/home',{title:'home',style:'style.css',user:true,product1,banner1:banner1.image,log,data:userData.fname});
                }else if(!banner1 && banner2 && !banner3){
                    res.render('user/home',{title:'home',style:'style.css',user:true,product1,banner2:banner2.image,log,data:userData.fname});
                }else if(!banner1 && !banner2 && banner3){
                    res.render('user/home',{title:'home',style:'style.css',user:true,product1,banner3:banner3.image,log,data:userData.fname});
                }else if(banner1 && banner2 && !banner3){
                    res.render('user/home',{title:'home',style:'style.css',user:true,product1,banner1:banner1.image,banner2:banner2.image,log,data:userData.fname});
                }else if(!banner1 && banner2 && banner3){
                    res.render('user/home',{title:'home',style:'style.css',user:true,product1,banner2:banner2.image,banner3:banner3.image,log,data:userData.fname});
                }else if(banner1 && !banner2 && banner3){
                    res.render('user/home',{title:'home',style:'style.css',user:true,product1,banner1:banner1.image,banner3:banner3.image,log,data:userData.fname});
                }else if(banner1 && banner2 && banner3){
                    res.render('user/home',{title:'home',style:'style.css',user:true,product1,banner1:banner1.image,banner2:banner2.image,banner3:banner3.image,log,data:userData.fname});
                }

               
            }
        }else{
            const product1  = await Product.find().sort({_id:-1}).limit(4).lean().exec();
            const banner1 = await Banner.findOne({position:'home1'}).lean();
            const banner2 = await Banner.findOne({position:'home2'}).lean();
            const banner3 = await Banner.findOne({position:'home3'}).lean();
           
            if(banner1 && !banner2&&!banner3){
                res.render('user/home',{title:'home',style:'style.css',user:true,product1,banner1:banner1.image});
            }else if(!banner1 && banner2 && !banner3){
                res.render('user/home',{title:'home',style:'style.css',user:true,product1,banner2:banner2.image});
            }else if(!banner1 && !banner2 && banner3){
                res.render('user/home',{title:'home',style:'style.css',user:true,product1,banner3:banner3.image});
            }else if(banner1 && banner2 && !banner3){
                res.render('user/home',{title:'home',style:'style.css',user:true,product1,banner1:banner1.image,banner2:banner2.image});
            }else if(!banner1 && banner2 && banner3){
                res.render('user/home',{title:'home',style:'style.css',user:true,product1,banner2:banner2.image,banner3:banner3.image});
            }else if(banner1 && !banner2 && banner3){
                res.render('user/home',{title:'home',style:'style.css',user:true,product1,banner1:banner1.image,banner3:banner3.image});
            }else if(banner1 && banner2 && banner3){
                res.render('user/home',{title:'home',style:'style.css',user:true,product1,banner1:banner1.image,banner2:banner2.image,banner3:banner3.image});
            }

           
        }
    


        
    }
    catch(err){
        console.log(err.message)
    }
}

const aboutLoad = async(req,res)=>{
    try{
        const log = req.session.user_id;
        if(log){
            res.render('user/about',{title:'About us',user:true,style:'style.css',log});
        }else{
            res.render('user/about',{title:'About us',user:true,style:'style.css'});
        }

    }
    catch(err){
        console.log(err.message);
    }
}


const contactLoad = async(req,res)=>{
    try{
        res.render('user/contact',{title:'Contact us',style:'style.css',user:true});
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports={loadHome,aboutLoad,contactLoad};