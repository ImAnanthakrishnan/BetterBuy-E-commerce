const Cart = require('../model/cartModel');
const Address = require('../model/addressModel');
const Product = require('../model/productModel');
const Order = require('../model/ordersModel');
const Wallet = require('../model/walletModel');
const User = require('../model/userModel');
const mongoose =  require('mongoose');


const Razorpay = require('razorpay');
const {RAZORPAY_ID_KEY , RAZORPAY_SECRET_KEY} = process.env;

const razorpayInstance = new Razorpay({
    key_id : RAZORPAY_ID_KEY,
    key_secret : RAZORPAY_SECRET_KEY
});


const loadCheckout = async(req,res)=>{
    try{
        const log = req.session.user_id;
        const id = req.session.user_id;
        const cartData = await Cart.find({userId:id}).populate('product.productId').lean();
        if(Array.isArray(cartData) && cartData.length>0){
            if(Array.isArray(cartData[0].product) && cartData[0].product.length>0){
    

        const address = await Address.find({user_id:id}).lean()
        if(address.length>0){
   
       const addresData = address.find(address=>address.address)
    
       const min = 1;
       const filterCartData = cartData.map(item=>({
            ...item,product:item.product.filter(product=>product.quantity>=min )
       })).filter(item=>item.product.length>0);

       const allQuantities = cartData.flatMap(item => item.product.map(product => product.quantity));
       const totalQuantity = allQuantities.reduce((sum, quantity) => sum + quantity, 0);
       
        res.render('user/checkout',{title:'Checkout',style:'style.css',user:true,cartData:filterCartData,address:addresData.address,totalQuantity,log,message10:req.flash('message10')});

        }else{
            const min = 1;
            const filterCartData = cartData.map(item=>({
                 ...item,product:item.product.filter(product=>product.quantity>=min )
            })).filter(item=>item.product.length>0);
     
            const allQuantities = cartData.flatMap(item => item.product.map(product => product.quantity));
            const totalQuantity = allQuantities.reduce((sum, quantity) => sum + quantity, 0);
            
             res.render('user/checkout',{title:'Checkout',style:'style.css',user:true,cartData:filterCartData,totalQuantity,log});
        }

    }else{
        const log = req.session.user_id;
        const id = req.session.user_id;

       const cart = await Cart.find({userId:id}).populate('product.productId').lean();
        res.render('user/cart',{title:'Cart',user:true,style:'style.css',log,cart,userId:id,message:'Please purchase some products'});
    
      }
    
   }

}
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal server error'})
    }
}



const generateOrderId = () => {
  
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
};

const placeOrder = async(req,res)=>{
    try{
        console.log(req.body.proName)
       console.log(req.body.address);
       console.log(req.body.district);
       console.log(req.body.city);
       console.log(req.body.pincode);
       console.log(req.body.state);
       console.log(req.body.country);
        const log = req.session.user_id;
        const id = req.session.user_id;
        const cartData = await Cart.find({userId:id}).populate('product.productId');
        const allQuantities = cartData.flatMap(item => item.product.map(product => product.quantity));
       const totalQuantity = allQuantities.reduce((sum, quantity) => sum + quantity, 0);
       const totalPrice = cartData.length>0 ? cartData[0].totalPrice : 0;
       const productId= req.body.productId;
   
      console.log(req.body.quantity1)
     // const quantityArray = req.body.quantity1.map(quantity => quantity);
      const quantityArray = Array.isArray(req.body.quantity1)
      ? req.body.quantity1.map(quantity => quantity)
      : [req.body.quantity1];
      // const priceArray = req.body.price.map(price => parseFloat(price));
      const priceArray = Array.isArray(req.body.price)
      ? req.body.price.map(price => parseFloat(price))
      : [parseFloat(req.body.price)];

      const nameArray = Array.isArray(req.body.proName)
      ? req.body.proName.map(name => name)
      : [req.body.proName];

       /*const productsArray = req.body.productId.map((productId, index) => ({
        productId: productId,
        quantity: quantityArray[index],
        price: priceArray[index],
      }));*/

    const productsArray = Array.isArray(req.body.productId)
  ? req.body.productId.map((productId, index) => ({
      productId: productId,
      name:nameArray[index],
      quantity: quantityArray[index],
      price: priceArray[index],
      name:nameArray[index]
    }))
  : [
      {
        productId: req.body.productId,
        quantity: quantityArray[0],
        price: priceArray[0],
      },
    ];

    
      console.log(priceArray)
       const order_Data = new Order({
        userId:req.session.user_id,
        product:productsArray,
        fullname:req.body.fname,
        phone:req.body.phone,
        address:[{
            address:req.body.address,
            district:req.body.district,
            city:req.body.city,
            pincode:req.body.pincode,
            state:req.body.state,
            country:req.body.country
        }],
        paymentMethod: req.body.payment,
        quantity:totalQuantity,
        totalPrice:totalPrice
       });
      

       const productsToUpdate = [];
       const errors = [];

       //const productIds = req.body.productId;
       const productIds = Array.isArray(req.body.productId)
       ? req.body.productId
       : [req.body.productId];


      console.log(req.body.payment)
      const orderId = generateOrderId();
      console.log(orderId);
      if(req.body.payment === "UPI"){
      
        for(let i=0 ; i < productIds.length ; i++){
            const productId = productIds[i];
            const subtract = quantityArray[i];
    
            const products = await Product.findById(productId);
    
            if(products && subtract<=products.quantity ){
                productsToUpdate.push({
                    products,
                    subtract
                });
            }else{
                //console.error(`Product with ID ${productId} not found.`);
                errors.push({
                    productId,
                    productName:products ? products.name : undefined,
                    quantityInStock: products ? products.quantity : undefined
                });
            }
          }

          if (errors.length > 0) {
            const errorMessages = errors.map(error => {
                const productName = error.productName || 'Product';
                const quantityInStock = error.quantityInStock || 'N/A';
                return `${productName} is in insufficient quantity. Currently in stock: ${quantityInStock}`;
            }).join('\n');
            console.error(errorMessages);
            //throw new Error(errorMessages);
            const response = {errorMessages};
            return res.status(400).json(response);
        }
    
        for (const { products, subtract } of productsToUpdate) {
            products.quantity -= subtract;
            if(products.quantity === 0){
                products.status = 'Unavailable';
                products.is_cancelled = true;
            }
            await products.save();
        }


        const amount = totalPrice*100;
        const options = {
            amount : amount,
            currency : "INR",
            receipt : orderId
        }
       console.log(options)
        const orderPromise = new Promise((resolve,reject)=>{
                razorpayInstance.orders.create(options,(err,order)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(order)
                    }
                });
        });

        const order = await orderPromise;

        const response = {
            method:"UPI",
            sucess:true,
            amount:amount,
            key_id:RAZORPAY_ID_KEY,
            contact:req.body.phone,
            name:req.session.user_id,
            order:order
        }
      console.log(order);
        res.status(200).json(response);

     
        /*razorpayInstance.orders.create.create(options,
            (err,order)=>{
                if(!err){
                    res.status(200).json({
                        success:true,
                        msg:'Order Placed',
                        amount:amount,
                        key_id:RAZORPAY_ID_KEY,
                        product_name:req.body.name,
                        contact:req.body.phone,
                        name:req.body.fname,
                    });
                }else{
                    res.status(400).json({success:false,msg:'Something went wrong'});
                }
            })*/

      }else if(req.body.payment === "WALLET"){
        
     
            const wallet = await Wallet.findOne({userId:id});
          // const walletTotal = wallet.find(total=>total)
            const cartTotal = cartData.find(total=>total)
           console.log(wallet.totalPrice);
           console.log(cartTotal.totalPrice);
           console.log('wal-',wallet.totalPrice);
            if(cartTotal.totalPrice<=wallet.totalPrice){
                
                const updatedTotal = wallet.totalPrice - cartTotal.totalPrice;
                 console.log(updatedTotal);

                 for(let i=0 ; i < productIds.length ; i++){
                    const productId = productIds[i];
                    const subtract = quantityArray[i];
        
                    const products = await Product.findById(productId);
            
                    if(products && subtract<=products.quantity ){
                        productsToUpdate.push({
                            products,
                            subtract
                        });
                    }else{
                        //console.error(`Product with ID ${productId} not found.`);
                        errors.push({
                            productId,
                            productName:products ? products.name : undefined,
                            quantityInStock: products ? products.quantity : undefined
                        });
                    }
                  }
        
                  if (errors.length > 0) {
                    const errorMessages = errors.map(error => {
                        const productName = error.productName || 'Product';
                        const quantityInStock = error.quantityInStock || 'N/A';
                        return `${productName} is in insufficient quantity. Currently in stock: ${quantityInStock}`;
                    }).join('\n');
                    console.error(errorMessages);
                    //throw new Error(errorMessages);
                    const response = {errorMessages};
                    return res.status(400).json(response);
                }
                
                for(const { products, subtract } of productsToUpdate){
                    products.quantity -= subtract;
                    if(products.quantity === 0){
                        products.status = 'Unavailable';
                        products.is_cancelled = true;
                    }
                    await products.save();
                }
        

                    const orderData = await order_Data.save();
                    const wallet1 = await Wallet.findOneAndUpdate({userId:id},{$set:{totalPrice:updatedTotal}},{new:true});

                    console.log(wallet1)
                    const response = {
                        message:'Order Placed',
                        payment:req.body.payment
                    }
                    res.status(200).json(response)
                    const updated =  await Cart.updateOne({
                        userId:id,'product.productId':{$in:Array.isArray(productId) ? productId:[productId]}
                       },
                       {
                        $pull:{product:{productId:{$in:Array.isArray(productId) ? productId:[productId]}}},
                       });
                
            }else{
                //throw new Error('Insufficient balance.Choose another option');
                const response = {errorMessages:'Insufficient balance.Choose another option'};
                return res.status(400).json(response)
            }
      }
      else{
        const paymentMethod = req.body.payment;
       console.log(paymentMethod);

        for(let i=0 ; i < productIds.length ; i++){
            const productId = productIds[i];
            const subtract = quantityArray[i];
    
            const products = await Product.findById(productId);
    
            if(products && subtract<=products.quantity ){
                productsToUpdate.push({
                    products,
                    subtract
                });
            }else{
                //console.error(`Product with ID ${productId} not found.`);
                errors.push({
                    productId,
                    productName:products ? products.name : undefined,
                    quantityInStock: products ? products.quantity : undefined
                });
            }
          }

          if (errors.length > 0) {
            const errorMessages = errors.map(error => {
                const productName = error.productName || 'Product';
                const quantityInStock = error.quantityInStock || 'N/A';
                return `${productName} is in insufficient quantity. Currently in stock: ${quantityInStock}`;
            }).join('\n');
            console.error(errorMessages);
            //throw new Error(errorMessages);
            const response = {errorMessages};
            return res.status(400).json(response);
        }
    
        for (const { products, subtract } of productsToUpdate) {
            products.quantity -= subtract;
            if(products.quantity === 0){
                products.status = 'Unavailable';
                products.is_cancelled = true;
            }
            await products.save();
        }
 

        const orderData = await order_Data.save();
        if(orderData){
            //res.render('user/orderplaced',{title:'Orderstatus',style:'style.css',user:true,log});   
            const response = {
                message:'Order Placed',
                payment:paymentMethod
            }
            res.status(200).json(response)
            const updated =  await Cart.updateOne({
                userId:id,'product.productId':{$in:Array.isArray(productId) ? productId:[productId]}
               },
               {
                $pull:{product:{productId:{$in:Array.isArray(productId) ? productId:[productId]}}},
               });

               const user = await User.findById(req.session.user_id);
               const count =await Wallet.find({userId:req.session.user_id}).count(); 
               if(user.refferedCode && user.is_reffered === false){
                
                if(count===0){
                    const wallet = new Wallet({
                        userId:req.session.user_id,
                       totalPrice:50
                    });
                    const res= await wallet.save();

                    await User.findByIdAndUpdate(req.session.user_id,{is_reffered:true});
                }

               }

               const referdUser = await User.findOne({referalCode:user.refferedCode});
               if(referdUser && user.is_reffered === false){

                const user1 = await User.findOne({referalCode:user.refferedCode});
   
                const count1 = await Wallet.find({userId:user1._id})
 

                if(count1.length === 0 ){
         
                    const wallet = new Wallet({
                        userId:referdUser._id,
                       totalPrice:100
                    });
                    const res= await wallet.save();
                  
                   }else if(count1.length>0){
                     
                        const wallet1 = await Wallet.findOne({userId:referdUser._id});
                        if(wallet1){
                           
                            await Wallet.findOneAndUpdate({userId:referdUser._id},{$inc:{totalPrice:100}},{new:true});
                         
                        }else{
                           
                            const wallet = new Wallet({
                                userId:referdUser._id,
                                totalPrice:100
                            });
                            const res= await wallet.save();
                      
                        }
                   }


               }
              
           }
        }
    }

    
    catch(err){
        console.log(err.message)
        const response={
            error:err.message
        }
        res.status(400).json(response);
    }
}

const razorpayVerify = async(req,res)=>{
    try{
        console.log(req.body.proName);
        console.log(req.body.productId)
        const log = req.session.user_id;
        const id = req.session.user_id;
        const cartData = await Cart.find({userId:id}).populate('product.productId');
        const allQuantities = cartData.flatMap(item => item.product.map(product => product.quantity));
       const totalQuantity = allQuantities.reduce((sum, quantity) => sum + quantity, 0);
       const totalPrice = cartData.length>0 ? cartData[0].totalPrice : 0;
       const productId= req.body.productId;

       
      console.log(req.body.quantity1)
      // const quantityArray = req.body.quantity1.map(quantity => quantity);
       const quantityArray = Array.isArray(req.body.quantity1)
       ? req.body.quantity1.map(quantity => quantity)
       : [req.body.quantity1];
       // const priceArray = req.body.price.map(price => parseFloat(price));
       const priceArray = Array.isArray(req.body.price)
       ? req.body.price.map(price => parseFloat(price))
       : [parseFloat(req.body.price)];

       const nameArray = Array.isArray(req.body.proName)
       ? req.body.proName.map(name => name)
       : [req.body.proName];

   
       const productsArray = Array.isArray(req.body.productId)
       ? req.body.productId.map((productId, index) => ({
           productId: productId,
           quantity: quantityArray[index],
           price: priceArray[index],
           name:nameArray[index]
         }))
       : [
           {
             productId: req.body.productId,
             quantity: quantityArray[0],
             price: priceArray[0],
           },
         ];

         console.log(priceArray)
         const order_Data = new Order({
          userId:req.session.user_id,
          product:productsArray,
          fullname:req.body.fname,
          phone:req.body.phone,
          address:[{
            address:req.body.address,
            district:req.body.district,
            city:req.body.city,
            pincode:req.body.pincode,
            state:req.body.state,
            country:req.body.country
        }],
          paymentMethod: req.body.payment,
          quantity:totalQuantity,
          totalPrice:totalPrice
         });


         const orderData = await order_Data.save();
        
         if(orderData){
            //res.render('user/orderplaced',{title:'Orderstatus',style:'style.css',user:true,log});
            const response = {
                success:true,
                message:'Order Placed',
                error:'Order failed',
                payment:req.body.payment
            }
            res.status(200).json(response)
            const updated =  await Cart.updateOne({
                userId:id,'product.productId':{$in:Array.isArray(productId) ? productId:[productId]}
               },
               {
                $pull:{product:{productId:{$in:Array.isArray(productId) ? productId:[productId]}}},
               });

               const user = await User.findById(req.session.user_id);
               const count =await Wallet.find({userId:req.session.user_id}).count(); 
               if(user.refferedCode && user.is_reffered === false){
                
                if(count===0){
                    const wallet = new Wallet({
                        userId:req.session.user_id,
                       totalPrice:50
                    });
                    const res= await wallet.save();

                    await User.findByIdAndUpdate(req.session.user_id,{is_reffered:true});
                }

               }

               const referdUser = await User.findOne({referalCode:user.refferedCode});
               if(referdUser && user.is_reffered === false){
                const user1 = await User.findOne({referalCode:user.refferedCode});
   
                const count1 = await Wallet.find({userId:user1._id})
 
                console.log('count=',count1.length)
                if(count1.length === 0 ){
         
                    const wallet = new Wallet({
                        userId:referdUser._id,
                       totalPrice:100
                    });
                    const res= await wallet.save();
                  
                   }else if(count1.length>0){
                     
                        const wallet1 = await Wallet.findOne({userId:referdUser._id});
                        if(wallet1){
                           
                            await Wallet.findOneAndUpdate({userId:referdUser._id},{$inc:{totalPrice:100}},{new:true});
                         
                        }else{
                           
                            const wallet = new Wallet({
                                userId:referdUser._id,
                                totalPrice:100
                            });
                            const res= await wallet.save();
                      
                        }
                   }


               }



           }else{
            //throw new Error('failed payment')
            const response = {errorMessages:'failed Payment'};
            return res.status(400).json(response);
           }
        





    }
    catch(err){
        console.log(err.message)
        const response = {
            error:err.message
         }
        res.status(400).json(response);
    }
}

const orderPlaceLoad = async(req,res)=>{
    try{
        const log = req.session.user_id;
        const orderData = await Order.find({userId:log}).populate('product.productId').populate('address').sort({_id:-1}).limit(1).lean();
        console.log(orderData);
        res.render('user/orderplaced',{title:'Orderstatus',style:'style.css',user:true,log,orderData});
    }
    catch(err){
        console.log(err.message)

        res.status(500).json({error:'Internal server error'});
    }
}

const orderDetailsLoad = async(req,res)=>{
    try{
        const log = req.session.user_id;
        const id = req.session.user_id;
       // const orderDatas = await Order.find({userId:id}).populate('product.productId').populate('address').lean();  
        var page =1;
        if(req.query.page){
            page=req.query.page;
        }
 
    const limit = 10; 
        const orderDatas = await Order.find({userId:id})
        .populate('product.productId')
        .populate('address')  
        .sort({ createdAt: -1 }) 
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean()
        .exec();
        const count = await Order.find({userId:id}).countDocuments();
        const totalPages = Math.ceil(count/limit);
        const pages = [];
        for(let i = 1 ; i <= totalPages ; i++){
            pages.push({
                page:i,
                isCurrentPage:i===page,
            });
        }
        //const createdAtArray = orderDatas.map(order => order.createdAt);
        orderDatas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const orderData = orderDatas.map(order => {
            const isDelivered = order.status === 'Delivered';
            const isShipped = order.status === 'Out For Delivery';
            return {
                ...order,
                createdAt: new Date(order.createdAt).toLocaleDateString(),
                isDelivered,
                isShipped
            };
        });
          
        res.render('user/order-details',{title:'OrderDetails',user:true,style:'style.css',orderData,log,totalPages,currentPage:page,pages})
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal Server Error'});
    }
}

/*const loadplace = async(req,res)=>{
    try{
        res.render('user/orderplaced')
    }
    catch(err){
        console.log(err.message)
    }
}*/

const changeStatus = async(req,res)=>{
    try{
       const user = req.session.user_id;
        const id = req.body.orderId;

        console.log(id)
        
        const order = await Order.findByIdAndUpdate(id,{$set:{status:'Cancelled',is_cancelled:true}});

        const orderData = await Order.findById(id);
        for(const orderItem of orderData.product){
            const productId = orderItem.productId;
            const orderQuantity = orderItem.quantity;

            const product = await Product.findById(productId);

            if(product){
                product.quantity += orderQuantity;
                product.status = 'Available';
                product.is_cancelled = false;
                await product.save();
            }else{
                console.error(`Product with ID ${productId} not found in the Product collection.`);
            }
        }

        if(order){
            const response = {
                message:`Status changed`,
                error:'Status not changed'
            }
            res.status(200).json(response);
        
            
        
          
       if(req.body.paymentMethod!=='COD'){
        const count =await Wallet.countDocuments({}); 
        console.log('count',count);
     

        if(orderData && orderData.is_cancelled === true){
            const totalAmount = orderData.totalPrice;
            console.log('total',totalAmount)
           
           if(count === 0 ){
         
            const wallet = new Wallet({
                userId:user,
               totalPrice:totalAmount
            });
            const res= await wallet.save();
          
           }else if(count>0){
             
                const wallet1 = await Wallet.findOne({userId:user});
                if(wallet1){
                   
                    await Wallet.findOneAndUpdate({userId:user},{$inc:{totalPrice:totalAmount}},{new:true});
                 
                }else{
                   
                    const wallet = new Wallet({
                        userId:user,
                        totalPrice:totalAmount
                    });
                    const res= await wallet.save();
              
                }
           }
          
        }else{
            console.log('tefd')
        }
       }


    }
       
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal server error'});
    }
}



const changeStatus1 = async(req,res)=>{
    try{
       const user = req.session.user_id;
        const id = req.body.orderId;

        console.log(id)
        const order = await Order.findByIdAndUpdate(id,{$set:{status:'Return',is_return:true}});

        /*const orderData = await Order.findById(id);
        for(const orderItem of orderData.product){
            const productId = orderItem.productId;
            const orderQuantity = orderItem.quantity;

            const product = await Product.findById(productId);

            if(product){
                product.quantity += orderQuantity;
                product.status = 'Available';
                product.is_return = false;
                await product.save();
            }else{
                console.error(`Product with ID ${productId} not found in the Product collection.`);
            }
        }

        */if(order){
            const response = {
                message:`Status changed`,
                error:'Status not changed'
            }
            res.status(200).json(response);
        }
            
        
           

       /* const count =await Wallet.countDocuments({}); 
        console.log('count',count);
     

        if(orderData && orderData.is_return === true){
            const totalAmount = orderData.totalPrice;
            console.log('total',totalAmount)
           
           if(count === 0 ){
         
            const wallet = new Wallet({
                userId:user,
               totalPrice:totalAmount
            });
            const res= await wallet.save();
          
           }else if(count>0){
             
                const wallet1 = await Wallet.findOne({userId:user});
                if(wallet1){
                   
                    await Wallet.findOneAndUpdate({userId:user},{$inc:{totalPrice:totalAmount}},{new:true});
                 
                }else{
                   
                    const wallet = new Wallet({
                        userId:user,
                        totalPrice:totalAmount
                    });
                    const res= await wallet.save();
              
                }
           }
          
        }else{
            console.log('tefd')
        }

    }*/
       
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal server error'});
    }
}




const viewOrder = async(req,res)=>{
    try{
        const log = req.session.user_id;
        const id = req.query.id;
        const order = await Order.findOne({_id:id}).populate('product.productId').populate('address').lean();
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true 
        };
        order.createdAt = new Date(order.createdAt).toLocaleString(undefined,options);
        res.render('user/view-order',{title:'view order',user:true,style:'style.css',order,log});
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal server error'});
    }
}

module.exports = {loadCheckout,placeOrder,orderDetailsLoad,changeStatus,viewOrder,orderPlaceLoad,
razorpayVerify,changeStatus1};