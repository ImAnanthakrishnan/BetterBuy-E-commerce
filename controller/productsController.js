const Product = require('../model/productModel');
const Category = require('../model/categoryModel');
const User = require('../model/userModel');
const loadAllProducts = async(req,res)=>{
    try{
        //console.log('jjfds')
    const {stock1,cat1,price1,price2}=req.query;
    console.log(stock1);
    console.log(cat1);
    console.log(price1);
    console.log(price2)
        const log = req.session.user_id;
      if(log){
        if(!stock1 && cat1 && !price1&&!price2 || stock1 && !cat1 && !price1&&!price2 || price1&&price2 && !stock1&&!cat1){
            //const cat = await Category.findOne({category:category});
            //console.log(cat);
           // const categoryId = cat._id;
           // console.log(categoryId)
            const product = await Product.find({
                $or:[
                    {category_id:cat1},
                    {status:stock1},
                    {price:{$gte:price1,$lte:price2}}
                ]
            }).lean()
           // console.log(product)
            const user = await User.findById({_id:req.session.user_id}).lean();
    
            console.log(product)
            const response = {
                message:'succees',
                productIds:product,
                product,
                user
            }
            res.status(200).json(response);
 
         }else if(stock1 && cat1 && !price1&&!price2){
            const product = await Product.find({
                $and:[
                    {category_id:cat1},
                    {status:stock1},
                    
                ]
            }).lean()
            console.log(product)
            const user = await User.findById({_id:req.session.user_id}).lean();
    
            console.log(product)
            const response = {
                message:'succees',
                productIds:product,
                product,
                user
            }
            res.status(200).json(response);
           
        }else if(price1&&price2 && !stock1&&cat1 ){
            const product = await Product.find({
                $and:[
                    {category_id:cat1},
                    {price:{$gte:price1,$lte:price2}},
                    
                ]
            }).lean()
            console.log(product)
            const user = await User.findById({_id:req.session.user_id}).lean();
    
            console.log(product)
            const response = {
                message:'succees',
                productIds:product,
                product,
                user
            }
            res.status(200).json(response);
            console.log('no stock')
        }
        else if(price1&&price2 && stock1&&!cat1){
            const product = await Product.find({
                $and:[
                    {status:stock1},
                    {price:{$gte:price1,$lte:price2}},
                    
                ]
            }).lean()
           // console.log(product)
            const user = await User.findById({_id:req.session.user_id}).lean();
    
            console.log(product)
            const response = {
                message:'succees',
                productIds:product,
                product,
                user
            }
            res.status(200).json(response);
            console.log('no cat')
        }
        else if(price1&&price2 && stock1 && cat1){
            const product = await Product.find({
                $and:[
                    {category_id:cat1},
                    {status:stock1},
                    {price:{$gte:price1,$lte:price2}}
                ]
            }).lean()
            console.log(product)
            const user = await User.findById({_id:req.session.user_id}).lean();
    
           // console.log(product)
            const response = {
                message:'succees',
                productIds:product,
                product,
                user
            }
            res.status(200).json(response);
        }
         else{
            var page =1;
            if(req.query.page){
                page=req.query.page;
            }
            const limit = 12; 
            const product = await Product.find().limit(limit * 1).skip((page - 1) * limit).populate('category_id').lean().exec();
            const count = await Product.find().countDocuments();
            const totalPages = Math.ceil(count/limit);
            const pages = [];
            for(let i = 1 ; i <= totalPages ; i++){
                pages.push({
                    page:i,
                    isCurrentPage:i===page,
                });
            }
            const user = await User.findById({_id:req.session.user_id}).lean();
            const cat_data = await Category.find().lean();
            const products  =JSON.stringify(product);
            res.render('user/product',{title:'All',style:'style.css',user:true,product,user,log,products,cat_data,totalPages,currentPage:page,pages});
    
         }
        }else{
            var page =1;
            if(req.query.page){
                page=req.query.page;
            }
            const limit = 12; 
            const product = await Product.find().limit(limit * 1).skip((page - 1) * limit).populate('category_id').lean().exec();
            const count = await Product.find().countDocuments();
            const totalPages = Math.ceil(count/limit);
            const pages = [];
            for(let i = 1 ; i <= totalPages ; i++){
                pages.push({
                    page:i,
                    isCurrentPage:i===page,
                });
            }
           // const user = await User.findById({_id:req.session.user_id}).lean();
            const cat_data = await Category.find().lean();
            const products  =JSON.stringify(product);
            res.render('user/product',{title:'All',style:'style.css',user:true,product,products,cat_data,totalPages,currentPage:page,pages});
        }
    }
    catch(err){
       // throw new Error(err)
       console.log(err.message)
    }
}

const loadVegetables = async(req,res)=>{
    try{
        const log = req.session.user_id;
        const category = await Category.find({category:'Vegetables'}).lean();
        const user = await User.findById({_id:req.session.user_id}).lean();
        const product = await Product.find({category_id:category}).populate('category_id').lean();
        console.log(product)
        
       
        res.render('user/vegetables',{title:'All',style:'style.css',user:true,product,log,user})
    }
    catch(err){
        console.log(err.message)
    }
}

const loadFruits = async(req,res)=>{
    try{
        const log = req.session.user_id;
        const category = await Category.find({category:'Fruits'}).lean();
        const user = await User.findById({_id:req.session.user_id}).lean();
        const product = await Product.find({category_id:category}).populate('category_id').lean();
        console.log(product)
        
       
        res.render('user/fruits',{title:'All',style:'style.css',user:true,product,log,user});
    }
    catch(err){
        console.log(err.message)
    }
}


const loadSingleProduct =async(req,res)=>{
    try{
        const log = req.session.user_id;
        const id = req.query.id;
        console.log(id)

        const productData = await Product.findById({_id:id}).populate('category_id').lean();
        if(log){
            const user = await User.findById({_id:req.session.user_id}).lean();
            console.log(user)
        res.render('user/singleproduct',{product:productData,user:true,style:'style.css',user,log})
        }else{
            res.render('user/singleproduct',{product:productData,user:true,style:'style.css'})
        }
    }
    catch(err){
        console.log(err.message);
    }
}
module.exports={loadAllProducts,loadSingleProduct,loadVegetables,loadFruits}