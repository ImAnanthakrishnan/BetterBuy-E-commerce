const { response } = require('express');
const multer = require('multer');
const upload = multer();
const Product = require('../model/productModel');
const Cart = require('../model/cartModel');
const User = require('../model/userModel');
const { parse } = require('uuid');
const loadCart = async(req,res)=>{
    try{
        const log = req.session.user_id;
        const id = req.session.user_id;

       const cart = await Cart.find({userId:id}).populate('product.productId').lean();
     
        res.render('user/cart',{title:'Cart',user:true,style:'style.css',log,cart,userId:id});
    }
    catch(err){
        console.log(err.message);
    }
}


const add_to_cart = async(req,res)=>{
    try{
    
        if(req.session.user_id){

        const existingCart = await Cart.findOne({userId:req.body.userId});
 console.log(req.body.productName);


        if(existingCart){

            const existingProduc = existingCart.product
            const existingProduct1 = existingProduc.find(product => String(product.productId) === req.body.productId);
             console.log(existingProduct1)
            if(existingProduc && existingProduct1){

                const quantities =  existingProduct1.quantity;
                console.log(quantities)
                 const productCheck = await Product.findById(req.body.productId);
                 if(productCheck.quantity<=quantities){
                     const response = {
                        error:`Only ${productCheck.quantity} quantity of ${productCheck.name} is available. Already ${existingProduct1.quantity} quantity is listed in cart`
                     }
                  return res.status(400).json(response);
            
                }


            }

            const existingProduct = existingCart.product.find((p)=>String(p.productId) === String(req.body.productId));
          
            if(existingProduct){
               
            await Cart.updateOne({
                userId:req.body.userId,
                'product.productId':req.body.productId
            },
            {
              
                $inc:{'product.$.quantity':1,
            'product.$.price':parseFloat(req.body.price)},
            $set:{'product.$.name':req.body.productName},
            

            }
         );

    
        }else{
           
            await Cart.updateOne({
                userId:req.body.userId
            },
            {$push:{
                product:{
                    productId:req.body.productId,
                    name:req.body.productName,
                    price:parseFloat(req.body.price),
                    quantity:1
                }
            }
        }
    );

  
        }
        
        
    }else{  
            const cart_obj = new Cart({
                userId : req.body.userId,
                product:[{
                    productId:req.body.productId,
                    name:req.body.productName,
                    price:parseFloat(req.body.price),
                    quantity:1
                }],
               
            })
            const cartData = await cart_obj.save();

        

        }
       

        const updatedCart = await Cart.findOne({
            userId:req.body.userId,
            'product.productId':req.body.productId
        }).populate('product.productId');

        const totalPrice = updatedCart.product.reduce((sum,product)=>{
            return sum + parseFloat(product.price);
        },0);

        await Cart.updateOne({
            userId:req.body.userId,
            'product.productId':req.body.productId
        },
        {
            $set:{totalPrice}
        }
     );
    const response = {
        message:'cart updated successfully',
        updatedCart
    }
    res.status(200).json(response)
}else{
    console.log('sdfdhs')
   //  res.redirect('/');
  
    const response = {
       error:`Please login <a href="/" class="">Login</a>`
    }
 return res.status(400).json(response);


}
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}


const add_to_cart1 = async(req,res)=>{
    try{
        console.log(req.body.productName)
      if(req.session.user_id){
        const {userId,productId,price,quantity} = req.body;
        const existingCart = await Cart.findOne({userId:userId});
     
       console.log(quantity);


       // }


        if(existingCart){
        console.log('helo')
            const existingProduc = existingCart.product
            const existingProduct1 = existingProduc.find(product => String(product.productId) === productId);
             //console.log(existingProduct1.quantity)

            if(existingProduc && existingProduct1){
            
                const quantities =  parseInt(existingProduct1.quantity)+parseInt(quantity-1)
                console.log(quantities)
                 const productCheck = await Product.findById(productId);
                 console.log(productCheck.quantity)
                 if(productCheck.quantity<=quantities){
                    console.log('hey')
                     const response = {
                        error:`Only ${productCheck.quantity} quantity of ${productCheck.name} is available.
                         Already ${existingProduct1.quantity} quantity is listed in cart`
                     }
                  return res.status(400).json(response);
            
                }
            }/*else{

                    const quantities =  parseInt(existingProduct1.quantity)
                    console.log(quantities)
                     const productCheck = await Product.findById(productId);
                     console.log(productCheck.quantity)
                     if(productCheck.quantity<=quantities){
                        console.log('hey5')
                         const response = {
                            error:`Only ${productCheck.quantity} quantity of ${productCheck.name} is available.
                             Already ${existingProduct1.quantity} quantity is listed in cart`
                         }
                       res.status(200).json(response);
                
                    }
            }     */                                                   






            const existingProduct = existingCart.product.find((p)=>String(p.productId) === String(productId));
           // console.log(existingProduct.price);
            if(existingProduct){
                console.log('hey1')
                await Cart.updateOne(
                    {
                        userId:userId,
                        'product.productId':productId
                    },
                    {
                        $inc:{'product.$.quantity':quantity,
                        'product.$.price':parseFloat(price)*quantity },
                        $set:{'product.$.name':req.body.productName}
                    }
                    );

               
            }else{
                console.log('helo2')
                await Cart.updateOne({
                    userId:userId
                },
                {
                    $push:{product:{
                        productId:productId,
                        name:req.body.productName,
                        price:parseFloat(price)*quantity,
                        quantity:quantity
                    }}
                }
                );

             
            }
        }else{
            const cart_obj = new Cart({
                userId:userId,
                product:[{
                    productId:productId,
                    name:req.body.productName,
                    price:parseFloat(price)*quantity,
                    quantity:quantity
                }]
            });
            const cartData = await cart_obj.save();

         
        }

        const updatedCart = await Cart.findOne({
            userId:userId,
            'product.productId':productId
        }).populate('product.productId');

        const totalPrice = updatedCart.product.reduce((sum,product)=>{
            return sum + parseFloat(product.price);
        },0); 
      console.log(totalPrice);
            await Cart.updateOne({
                userId:userId,
                'product.productId':productId
            },
            {
                $set:{totalPrice}
            });

            const response = {
                message:'cart updated successfully',
                updatedCart
            }
            res.status(200).json(response);
        }else{
            const response = {
                error:`Please login <a href="/" class="">Login</a>`
             }
          return res.status(400).json(response);
        }
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({err:'Internal server error'});
    }
}

const updateCart = async(req,res)=>{
    try{
       
    const {userId,productId,quantity,price,action,nameInput} = req.body;
    console.log(nameInput)
    const productCheck = await Product.findById(productId);
    console.log(productCheck.quantity);
    console.log(quantity)
    if(productCheck.quantity<=quantity-1){
         const response = {
            error:`Only ${productCheck.quantity} quantity of ${productCheck.name} is available`
         }
      return res.status(400).json(response);

    }

    const updatedCart = await Cart.findOneAndUpdate(
        {
            userId:userId,
            'product.productId':productId
        },{
            $set:{
                'product.$.quantity': quantity,
                'product.$.price': parseFloat(price),
                'product.$.name':nameInput
            },
         
        },{
            new:true,
           // arrayFilters:[{'product.productId':productId}]
        }
    );

    const totalPrice = updatedCart.product.reduce((sum,product)=>{
        return sum+parseFloat(product.price);
    },0);

    await Cart.updateOne(
        {
            userId:userId,
            'product.productId':productId
        },
        {
            $set:{totalPrice:totalPrice}
        }
        );
        
        /*const quantities = updatedCart.product[0]?.quantity;
        const product = await Product.findById(productId);
        const stock = product.quantity;
           if(action === "inc"){
            console.log(stock);
            console.log(quantities)
          
            const updateStock = stock - quantities;
            console.log(updateStock)
            if(updateStock >= 0){
            
                const updatedStock = await Product.findByIdAndUpdate(productId,{$inc:{quantity:-1}});
               }else{
                 
               }
           }

           if(action === "desc"){
            console.log(stock);
            console.log(quantities)
            const updateStock = stock + (quantities+1);
            console.log(updateStock)
            if(updateStock >= 0){
            
                const updatedStock = await Product.findByIdAndUpdate(productId,{$inc:{quantity:1},$set:{status:'Available'}});
               }else{
                
               }
           }*/
           
          
    
        const response = {
            message:'Quantity and price updated successfully',
            updatedCart
        }
        res.status(200).json(response)

    }
  
    catch(err){
        console.log(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteProduct = async(req,res)=>{
    try{
     const {productId,userId,quantity} = req.body;
     console.log(productId);
     console.log(userId)
     const pro = await Product.findById(productId);
     const reducedAmount = pro.price*quantity;
     console.log(reducedAmount)
     const cart = await Cart.findOne({userId:userId,'product.productId':productId});
     
     if(cart){
        const updated =  await Cart.updateOne({
            userId:userId,'product.productId':productId
           },
           {
            $pull:{product:{productId:productId}},
            $inc:{totalPrice:-reducedAmount}
           });
         
         if(updated){
          
            const response = {
                updated,
                message:'Product Deleted'
            }
            res.status(200).json(response);
         }
     }
      
    }
    catch(err){
        console.log(err.message);
        res.status(200).json({error:'Internal server error'});
    }
}

module.exports = {loadCart,add_to_cart,add_to_cart1,updateCart,deleteProduct};