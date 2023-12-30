const Product = require('../model/productModel');
const Category = require('../model/categoryModel');
const User = require('../model/userModel');
const Offer = require('../model/categOfferModel');

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
            const limit = 9; 
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
            const op = product.find(pro=>pro.category_id);
            console.log(op)
            const user = await User.findById({_id:req.session.user_id}).lean();
            const cat_data = await Category.find().lean();
            const products  =JSON.stringify(product);

          
           const currentDate1 = new Date();
           const curDate = currentDate1 + "+00:00";
           const currentDate = new Date(curDate);
            console.log(currentDate);
           const expiredOffers = await Offer.find({ expireAt: { $lt: currentDate } });
           console.log('expiredoff-',expiredOffers);
           if (expiredOffers.length > 0) {
            // Iterate over expired offers
            console.log('helo');
            for (const expiredOffer of expiredOffers) {
                console.log('heu')
              const { category: expiredCategory } = expiredOffer;
            console.log('expiredcat-',expiredCategory);
              // Find associated products by category
              const cat = await Category.find({category:expiredCategory});
              const catIds = cat.map(category=>category._id)
              const associatedProducts = await Product.find({ category_id: {$in:catIds}, is_offer: true });
            console.log('associate-',associatedProducts);
              // Update each associated product
              for (const product of associatedProducts) {
                // Retrieve earlier price from the product
                const earlierPrice = product.earlierPrice;
              console.log('earlier-',earlierPrice);
                // Update the product
                await Product.findByIdAndUpdate(
                  product._id,
                  {
                    $set: {
                      price: earlierPrice,    
                      is_offer: false        
                    }
                  }
                );
              }
          
              // Delete the expired offer
              await Offer.findByIdAndDelete(expiredOffer._id);
            }
          
            console.log('Expired offers deleted and products updated.');
          } else {
            console.log('No expired offers.');
          }


            res.render('user/product',{title:'All',style:'style.css',user:true,product,user,log,products,cat_data,totalPages,currentPage:page,pages});
    
         }
        }else{
         

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
              //  const user = await User.findById({_id:req.session.user_id}).lean();
        
                console.log(product)
                const response = {
                    message:'succees',
                    productIds:product,
                    product,
                  //  user
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
              //  const user = await User.findById({_id:req.session.user_id}).lean();
        
                console.log(product)
                const response = {
                    message:'succees',
                    productIds:product,
                    product,
                  //  user
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
               // const user = await User.findById({_id:req.session.user_id}).lean();
        
                console.log(product)
                const response = {
                    message:'succees',
                    productIds:product,
                    product,
                   // user
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
               // const user = await User.findById({_id:req.session.user_id}).lean();
        
                console.log(product)
                const response = {
                    message:'succees',
                    productIds:product,
                    product,
                   // user
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
               // const user = await User.findById({_id:req.session.user_id}).lean();
        
               // console.log(product)
                const response = {
                    message:'succees',
                    productIds:product,
                    product,
                   // user
                }
                res.status(200).json(response);
            }
             else{
                var page =1;
                if(req.query.page){
                    page=req.query.page;
                }
                const limit = 9; 
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
                const cat_data = await Category.find().lean();
                const products  =JSON.stringify(product);
                res.render('user/product',{title:'All',style:'style.css',user:true,product,products,cat_data,totalPages,currentPage:page,pages});

            }


           // const user = await User.findById({_id:req.session.user_id}).lean();
  
           // 
        }
    }
    catch(err){
       // throw new Error(err)
       console.log(err.message)
    }
}

const loadVegetables = async(req,res)=>{
    try{
        const {stock1,price1,price2}=req.query;
        console.log(stock1);
        console.log(price1);
        console.log(price2)
        const log = req.session.user_id;
        const category = await Category.find({category:'Vegetables'}).lean();
        if(log){
            if(stock1 && !price1&&!price2 || !stock1 && price1&&price2){
              
               // const product = await Product.find({category_id:category}).populate('category_id').lean();
                const product = await Product.find({category_id:category,
                    $or:[
                        {status:stock1},
                        {price:{$gte:price1,$lte:price2}}
                    ]
                }).populate('category_id').lean()
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
            }else if(price1&&price2 && stock1){
                const product = await Product.find({category_id:category,
                    $and:[
                     
                        {status:stock1},
                        {price:{$gte:price1,$lte:price2}}
                    ]
                }).populate('category_id').lean()
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
            }else{

                var page =1;
                if(req.query.page){
                    page=req.query.page;
                }
                const limit = 9; 
                const product = await Product.find({category_id:category}).limit(limit * 1).skip((page - 1) * limit).populate('category_id').lean().exec();
                const count = await Product.find().countDocuments();
                const totalPages = Math.ceil(count/limit);
                const pages = [];
                for(let i = 1 ; i <= totalPages ; i++){
                    pages.push({
                        page:i,
                        isCurrentPage:i===page,
                    });
                }
                const op = product.find(pro=>pro.category_id);
                console.log(op)
                const user = await User.findById({_id:req.session.user_id}).lean();
                const cat_data = await Category.find().lean();
                const products  =JSON.stringify(product);
    
              
               const currentDate1 = new Date();
               const curDate = currentDate1 + "+00:00";
               const currentDate = new Date(curDate);
                console.log(currentDate);
               const expiredOffers = await Offer.find({ expireAt: { $lt: currentDate } });
               console.log('expiredoff-',expiredOffers);
               if (expiredOffers.length > 0) {
                // Iterate over expired offers
                console.log('helo');
                for (const expiredOffer of expiredOffers) {
                    console.log('heu')
                  const { category: expiredCategory } = expiredOffer;
                console.log('expiredcat-',expiredCategory);
                  // Find associated products by category
                  const cat = await Category.find({category:expiredCategory});
                  const catIds = cat.map(category=>category._id)
                  const associatedProducts = await Product.find({ category_id: {$in:catIds}, is_offer: true });
                console.log('associate-',associatedProducts);
                  // Update each associated product
                  for (const product of associatedProducts) {
                    // Retrieve earlier price from the product
                    const earlierPrice = product.earlierPrice;
                  console.log('earlier-',earlierPrice);
                    // Update the product
                    await Product.findByIdAndUpdate(
                      product._id,
                      {
                        $set: {
                          price: earlierPrice,    
                          is_offer: false        
                        }
                      }
                    );
                  }
              
                  // Delete the expired offer
                  await Offer.findByIdAndDelete(expiredOffer._id);
                }
              
                console.log('Expired offers deleted and products updated.');
              } else {
                console.log('No expired offers.');
              }
             // const user = await User.findById({_id:req.session.user_id}).lean();
    
                res.render('user/vegetables',{title:'Vegetables',style:'style.css',user:true,product,user,log,products,cat_data,totalPages,currentPage:page,pages});


            }

        }else{

            if(stock1 && !price1&&!price2 || !stock1 && price1&&price2){
              
                // const product = await Product.find({category_id:category}).populate('category_id').lean();
                 const product = await Product.find({category_id:category,
                     $or:[
                         {status:stock1},
                         {price:{$gte:price1,$lte:price2}}
                     ]
                 }).populate('category_id').lean()
                // console.log(product)
                
         
                 console.log(product)
                 const response = {
                     message:'succees',
                     productIds:product,
                     product,
                  
                 }
                 res.status(200).json(response);
             }else if(price1&&price2 && stock1){
                 const product = await Product.find({category_id:category,
                     $and:[
                      
                         {status:stock1},
                         {price:{$gte:price1,$lte:price2}}
                     ]
                 }).populate('category_id').lean()
                 console.log(product)
                
         
                // console.log(product)
                 const response = {
                     message:'succees',
                     productIds:product,
                     product,
                   
                 }
                 res.status(200).json(response);
             }else{
 
                 var page =1;
                 if(req.query.page){
                     page=req.query.page;
                 }
                 const limit = 9; 
                 const product = await Product.find({category_id:category}).limit(limit * 1).skip((page - 1) * limit).populate('category_id').lean().exec();
                 const count = await Product.find().countDocuments();
                 const totalPages = Math.ceil(count/limit);
                 const pages = [];
                 for(let i = 1 ; i <= totalPages ; i++){
                     pages.push({
                         page:i,
                         isCurrentPage:i===page,
                     });
                 }
                 res.render('user/vegetables',{title:'Vegetables',style:'style.css',user:true,product,totalPages,currentPage:page,pages});
                }




           // const category = await Category.find({category:'Vegetables'}).lean();
    
           // const user = await User.findById({_id:req.session.user_id}).lean();
            //const product = await Product.find({category_id:category}).populate('category_id').lean();
          //  console.log(product)
            
           
           

        }

    }
    catch(err){
        console.log(err.message)
    }
}

const loadFruits = async(req,res)=>{
    try{


        const {stock1,price1,price2}=req.query;
        console.log(stock1);
        console.log(price1);
        console.log(price2)
        const log = req.session.user_id;
        const category = await Category.find({category:'Fruits'}).lean();
        if(log){
            if(stock1 && !price1&&!price2 || !stock1 && price1&&price2){
              
               // const product = await Product.find({category_id:category}).populate('category_id').lean();
                const product = await Product.find({category_id:category,
                    $or:[
                        {status:stock1},
                        {price:{$gte:price1,$lte:price2}}
                    ]
                }).populate('category_id').lean()
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
            }else if(price1&&price2 && stock1){
                const product = await Product.find({category_id:category,
                    $and:[
                     
                        {status:stock1},
                        {price:{$gte:price1,$lte:price2}}
                    ]
                }).populate('category_id').lean()
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
            }else{

                var page =1;
                if(req.query.page){
                    page=req.query.page;
                }
                const limit = 9; 
                const product = await Product.find({category_id:category}).limit(limit * 1).skip((page - 1) * limit).populate('category_id').lean().exec();
                const count = await Product.find().countDocuments();
                const totalPages = Math.ceil(count/limit);
                const pages = [];
                for(let i = 1 ; i <= totalPages ; i++){
                    pages.push({
                        page:i,
                        isCurrentPage:i===page,
                    });
                }
                const op = product.find(pro=>pro.category_id);
                console.log(op)
                const user = await User.findById({_id:req.session.user_id}).lean();
                const cat_data = await Category.find().lean();
                const products  =JSON.stringify(product);
    
              
               const currentDate1 = new Date();
               const curDate = currentDate1 + "+00:00";
               const currentDate = new Date(curDate);
                console.log(currentDate);
               const expiredOffers = await Offer.find({ expireAt: { $lt: currentDate } });
               console.log('expiredoff-',expiredOffers);
               if (expiredOffers.length > 0) {
                // Iterate over expired offers
                console.log('helo');
                for (const expiredOffer of expiredOffers) {
                    console.log('heu')
                  const { category: expiredCategory } = expiredOffer;
                console.log('expiredcat-',expiredCategory);
                  // Find associated products by category
                  const cat = await Category.find({category:expiredCategory});
                  const catIds = cat.map(category=>category._id)
                  const associatedProducts = await Product.find({ category_id: {$in:catIds}, is_offer: true });
                console.log('associate-',associatedProducts);
                  // Update each associated product
                  for (const product of associatedProducts) {
                    // Retrieve earlier price from the product
                    const earlierPrice = product.earlierPrice;
                  console.log('earlier-',earlierPrice);
                    // Update the product
                    await Product.findByIdAndUpdate(
                      product._id,
                      {
                        $set: {
                          price: earlierPrice,    
                          is_offer: false        
                        }
                      }
                    );
                  }
              
                  // Delete the expired offer
                  await Offer.findByIdAndDelete(expiredOffer._id);
                }
              
                console.log('Expired offers deleted and products updated.');
              } else {
                console.log('No expired offers.');
              }
             // const user = await User.findById({_id:req.session.user_id}).lean();
    
                res.render('user/fruits',{title:'Fruits',style:'style.css',user:true,product,user,log,products,cat_data,totalPages,currentPage:page,pages});


            }

        }else{

            if(stock1 && !price1&&!price2 || !stock1 && price1&&price2){
              
                // const product = await Product.find({category_id:category}).populate('category_id').lean();
                 const product = await Product.find({category_id:category,
                     $or:[
                         {status:stock1},
                         {price:{$gte:price1,$lte:price2}}
                     ]
                 }).populate('category_id').lean()
                // console.log(product)
                
         
                 console.log(product)
                 const response = {
                     message:'succees',
                     productIds:product,
                     product,
                  
                 }
                 res.status(200).json(response);
             }else if(price1&&price2 && stock1){
                 const product = await Product.find({category_id:category,
                     $and:[
                      
                         {status:stock1},
                         {price:{$gte:price1,$lte:price2}}
                     ]
                 }).populate('category_id').lean()
                 console.log(product)
                
         
                // console.log(product)
                 const response = {
                     message:'succees',
                     productIds:product,
                     product,
                   
                 }
                 res.status(200).json(response);
             }else{
 
                 var page =1;
                 if(req.query.page){
                     page=req.query.page;
                 }
                 const limit = 9; 
                 const product = await Product.find({category_id:category}).limit(limit * 1).skip((page - 1) * limit).populate('category_id').lean().exec();
                 const count = await Product.find().countDocuments();
                 const totalPages = Math.ceil(count/limit);
                 const pages = [];
                 for(let i = 1 ; i <= totalPages ; i++){
                     pages.push({
                         page:i,
                         isCurrentPage:i===page,
                     });
                 }
                 res.render('user/fruits',{title:'Fruits',style:'style.css',user:true,product,totalPages,currentPage:page,pages});
                }




           // const category = await Category.find({category:'Vegetables'}).lean();
    
           // const user = await User.findById({_id:req.session.user_id}).lean();
            //const product = await Product.find({category_id:category}).populate('category_id').lean();
          //  console.log(product)
            
           
           

        }



    }
    catch(err){
        console.log(err.message)
    }
}


const loadMeat = async(req,res)=>{
    try{
        const {stock1,price1,price2}=req.query;
        console.log(stock1);
        console.log(price1);
        console.log(price2)
        const log = req.session.user_id;
        const category = await Category.find({category:'Meat'}).lean();
        if(log){
            if(stock1 && !price1&&!price2 || !stock1 && price1&&price2){
              
               // const product = await Product.find({category_id:category}).populate('category_id').lean();
                const product = await Product.find({category_id:category,
                    $or:[
                        {status:stock1},
                        {price:{$gte:price1,$lte:price2}}
                    ]
                }).populate('category_id').lean()
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
            }else if(price1&&price2 && stock1){
                const product = await Product.find({category_id:category,
                    $and:[
                     
                        {status:stock1},
                        {price:{$gte:price1,$lte:price2}}
                    ]
                }).populate('category_id').lean()
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
            }else{

                var page =1;
                if(req.query.page){
                    page=req.query.page;
                }
                const limit = 9; 
                const product = await Product.find({category_id:category}).limit(limit * 1).skip((page - 1) * limit).populate('category_id').lean().exec();
                const count = await Product.find().countDocuments();
                const totalPages = Math.ceil(count/limit);
                const pages = [];
                for(let i = 1 ; i <= totalPages ; i++){
                    pages.push({
                        page:i,
                        isCurrentPage:i===page,
                    });
                }
                const op = product.find(pro=>pro.category_id);
                console.log(op)
                const user = await User.findById({_id:req.session.user_id}).lean();
                const cat_data = await Category.find().lean();
                const products  =JSON.stringify(product);
    
              
               const currentDate1 = new Date();
               const curDate = currentDate1 + "+00:00";
               const currentDate = new Date(curDate);
                console.log(currentDate);
               const expiredOffers = await Offer.find({ expireAt: { $lt: currentDate } });
               console.log('expiredoff-',expiredOffers);
               if (expiredOffers.length > 0) {
                // Iterate over expired offers
                console.log('helo');
                for (const expiredOffer of expiredOffers) {
                    console.log('heu')
                  const { category: expiredCategory } = expiredOffer;
                console.log('expiredcat-',expiredCategory);
                  // Find associated products by category
                  const cat = await Category.find({category:expiredCategory});
                  const catIds = cat.map(category=>category._id)
                  const associatedProducts = await Product.find({ category_id: {$in:catIds}, is_offer: true });
                console.log('associate-',associatedProducts);
                  // Update each associated product
                  for (const product of associatedProducts) {
                    // Retrieve earlier price from the product
                    const earlierPrice = product.earlierPrice;
                  console.log('earlier-',earlierPrice);
                    // Update the product
                    await Product.findByIdAndUpdate(
                      product._id,
                      {
                        $set: {
                          price: earlierPrice,    
                          is_offer: false        
                        }
                      }
                    );
                  }
              
                  // Delete the expired offer
                  await Offer.findByIdAndDelete(expiredOffer._id);
                }
              
                console.log('Expired offers deleted and products updated.');
              } else {
                console.log('No expired offers.');
              }
             // const user = await User.findById({_id:req.session.user_id}).lean();
    
                res.render('user/meat',{title:'Meat',style:'style.css',user:true,product,user,log,products,cat_data,totalPages,currentPage:page,pages});


            }

        }else{

            if(stock1 && !price1&&!price2 || !stock1 && price1&&price2){
              
                // const product = await Product.find({category_id:category}).populate('category_id').lean();
                 const product = await Product.find({category_id:category,
                     $or:[
                         {status:stock1},
                         {price:{$gte:price1,$lte:price2}}
                     ]
                 }).populate('category_id').lean()
                // console.log(product)
                
         
                 console.log(product)
                 const response = {
                     message:'succees',
                     productIds:product,
                     product,
                  
                 }
                 res.status(200).json(response);
             }else if(price1&&price2 && stock1){
                 const product = await Product.find({category_id:category,
                     $and:[
                      
                         {status:stock1},
                         {price:{$gte:price1,$lte:price2}}
                     ]
                 }).populate('category_id').lean()
                 console.log(product)
                
         
                // console.log(product)
                 const response = {
                     message:'succees',
                     productIds:product,
                     product,
                   
                 }
                 res.status(200).json(response);
             }else{
 
                 var page =1;
                 if(req.query.page){
                     page=req.query.page;
                 }
                 const limit = 9; 
                 const product = await Product.find({category_id:category}).limit(limit * 1).skip((page - 1) * limit).populate('category_id').lean().exec();
                 const count = await Product.find().countDocuments();
                 const totalPages = Math.ceil(count/limit);
                 const pages = [];
                 for(let i = 1 ; i <= totalPages ; i++){
                     pages.push({
                         page:i,
                         isCurrentPage:i===page,
                     });
                 }
                 res.render('user/meat',{title:'Meat',style:'style.css',user:true,product,totalPages,currentPage:page,pages});
                }




           // const category = await Category.find({category:'Vegetables'}).lean();
    
           // const user = await User.findById({_id:req.session.user_id}).lean();
            //const product = await Product.find({category_id:category}).populate('category_id').lean();
          //  console.log(product)
            
           
           

        }

    }
    catch(err){
        console.log(err.message)
    }
}

const loadBread = async(req,res)=>{
    try{
        const {stock1,price1,price2}=req.query;
        console.log(stock1);
        console.log(price1);
        console.log(price2)
        const log = req.session.user_id;
        const category = await Category.find({category:'Breads'}).lean();
        if(log){
            if(stock1 && !price1&&!price2 || !stock1 && price1&&price2){
              
               // const product = await Product.find({category_id:category}).populate('category_id').lean();
                const product = await Product.find({category_id:category,
                    $or:[
                        {status:stock1},
                        {price:{$gte:price1,$lte:price2}}
                    ]
                }).populate('category_id').lean()
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
            }else if(price1&&price2 && stock1){
                const product = await Product.find({category_id:category,
                    $and:[
                     
                        {status:stock1},
                        {price:{$gte:price1,$lte:price2}}
                    ]
                }).populate('category_id').lean()
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
            }else{

                var page =1;
                if(req.query.page){
                    page=req.query.page;
                }
                const limit = 9; 
                const product = await Product.find({category_id:category}).limit(limit * 1).skip((page - 1) * limit).populate('category_id').lean().exec();
                const count = await Product.find().countDocuments();
                const totalPages = Math.ceil(count/limit);
                const pages = [];
                for(let i = 1 ; i <= totalPages ; i++){
                    pages.push({
                        page:i,
                        isCurrentPage:i===page,
                    });
                }
                const op = product.find(pro=>pro.category_id);
                console.log(op)
                const user = await User.findById({_id:req.session.user_id}).lean();
                const cat_data = await Category.find().lean();
                const products  =JSON.stringify(product);
    
              
               const currentDate1 = new Date();
               const curDate = currentDate1 + "+00:00";
               const currentDate = new Date(curDate);
                console.log(currentDate);
               const expiredOffers = await Offer.find({ expireAt: { $lt: currentDate } });
               console.log('expiredoff-',expiredOffers);
               if (expiredOffers.length > 0) {
                // Iterate over expired offers
                console.log('helo');
                for (const expiredOffer of expiredOffers) {
                    console.log('heu')
                  const { category: expiredCategory } = expiredOffer;
                console.log('expiredcat-',expiredCategory);
                  // Find associated products by category
                  const cat = await Category.find({category:expiredCategory});
                  const catIds = cat.map(category=>category._id)
                  const associatedProducts = await Product.find({ category_id: {$in:catIds}, is_offer: true });
                console.log('associate-',associatedProducts);
                  // Update each associated product
                  for (const product of associatedProducts) {
                    // Retrieve earlier price from the product
                    const earlierPrice = product.earlierPrice;
                  console.log('earlier-',earlierPrice);
                    // Update the product
                    await Product.findByIdAndUpdate(
                      product._id,
                      {
                        $set: {
                          price: earlierPrice,    
                          is_offer: false        
                        }
                      }
                    );
                  }
              
                  // Delete the expired offer
                  await Offer.findByIdAndDelete(expiredOffer._id);
                }
              
                console.log('Expired offers deleted and products updated.');
              } else {
                console.log('No expired offers.');
              }
             // const user = await User.findById({_id:req.session.user_id}).lean();
    
                res.render('user/bread',{title:'Bread',style:'style.css',user:true,product,user,log,products,cat_data,totalPages,currentPage:page,pages});


            }

        }else{

            if(stock1 && !price1&&!price2 || !stock1 && price1&&price2){
              
                // const product = await Product.find({category_id:category}).populate('category_id').lean();
                 const product = await Product.find({category_id:category,
                     $or:[
                         {status:stock1},
                         {price:{$gte:price1,$lte:price2}}
                     ]
                 }).populate('category_id').lean()
                // console.log(product)
                
         
                 console.log(product)
                 const response = {
                     message:'succees',
                     productIds:product,
                     product,
                  
                 }
                 res.status(200).json(response);
             }else if(price1&&price2 && stock1){
                 const product = await Product.find({category_id:category,
                     $and:[
                      
                         {status:stock1},
                         {price:{$gte:price1,$lte:price2}}
                     ]
                 }).populate('category_id').lean()
                 console.log(product)
                
         
                // console.log(product)
                 const response = {
                     message:'succees',
                     productIds:product,
                     product,
                   
                 }
                 res.status(200).json(response);
             }else{
 
                 var page =1;
                 if(req.query.page){
                     page=req.query.page;
                 }
                 const limit = 9; 
                 const product = await Product.find({category_id:category}).limit(limit * 1).skip((page - 1) * limit).populate('category_id').lean().exec();
                 const count = await Product.find().countDocuments();
                 const totalPages = Math.ceil(count/limit);
                 const pages = [];
                 for(let i = 1 ; i <= totalPages ; i++){
                     pages.push({
                         page:i,
                         isCurrentPage:i===page,
                     });
                 }
                 res.render('user/bread',{title:'Bread',style:'style.css',user:true,product,totalPages,currentPage:page,pages});
                }




           // const category = await Category.find({category:'Vegetables'}).lean();
    
           // const user = await User.findById({_id:req.session.user_id}).lean();
            //const product = await Product.find({category_id:category}).populate('category_id').lean();
          //  console.log(product)
            
           
           

        }

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
        if(productData){
        if(log){
            const user = await User.findById({_id:req.session.user_id}).lean();
            console.log(user)
        res.render('user/singleproduct',{product:productData,user:true,style:'style.css',user,log})
        }else{
            res.render('user/singleproduct',{product:productData,user:true,style:'style.css'})
        }
    }else{
        res.render('404');
    }
    }
    catch(err){
        console.log(err.message);
    }
}


module.exports={loadAllProducts,loadSingleProduct,loadVegetables,loadFruits,loadMeat,loadBread};