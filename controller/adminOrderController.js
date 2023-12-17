const Order = require('../model/ordersModel');
const Wallet = require('../model/walletModel');
const Product = require('../model/productModel');

const orderDetails = async(req,res)=>{
    try{
    const orderDatas = await Order.find().populate('product.productId').populate('address').lean();
      /*let cancel = false;
       const cancell = orderData.find(order=>order.status === 'Cancelled'); 
        
        if(cancell) cancel=true;
        console.log(cancel)*/

        const orderData = orderDatas.map(order => {
            return {
                ...order,
                createdAt: new Date(order.createdAt).toLocaleDateString()
            };
        });

        res.render('admin/orders',{title:'OrderDetails',admin:true,style:'admin.css',orderData})
    }
    
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal server error'});
    }
}

const changeStatus = async(req,res)=>{
    try{

        const {orderId,newStatus} = req.body;
        if(newStatus === 'Cancelled'){
            const order = await Order.findByIdAndUpdate({_id:orderId},{$set:{status:newStatus,is_cancelled:true}});

            const orderData = await Order.findById(orderId);
            for(const orderItem of orderData.product){
                const productId = orderItem.productId;
                const orderQuantity = orderItem.quantity;
    
                const product = await Product.findById(productId);
    
                if(product){
                    product.quantity += orderQuantity;
                    await product.save();
                }else{
                    console.error(`Product with ID ${productId} not found in the Product collection.`);
                }
            }
 
            if(order){
                const response = {
                    message:`Status changed `,
                    error:'Status not changed'
                }
                res.status(200).json(response);
            }

            
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
            const order = await Order.findByIdAndUpdate({_id:orderId},{$set:{status:newStatus}});
            if(order){
                const response = {
                    message:`Status changed `,
                    error:'Status not changed'
                }
                res.status(201).json(response);
            }
        }
       
      
       
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal server error'})
    }
}

const deleteOrder = async(req,res)=>{
    try{
    const id = req.query.id;
    const order = await Order.deleteOne({_id:id});
    if(order){
        res.redirect('/admin/orders');
     }
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal server error'});
    }
}

const refund = async(req,res)=>{
    try{
        const user = req.session.user_id;
  const id = req.body.orderId;
  console.log(id);
  const order = await Order.findByIdAndUpdate(id,{$set:{is_cancelled:true}});

  const orderData = await Order.findById(id);
  for(const orderItem of orderData.product){
      const productId = orderItem.productId;
      const orderQuantity = orderItem.quantity;

      const product = await Product.findById(productId);

      if(product){
          product.quantity += orderQuantity;
          product.status = 'Available';
          product.is_return = true;
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

    const count =await Wallet.countDocuments({}); 
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

}

    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal server error'});
    }
}

module.exports = {orderDetails,changeStatus,deleteOrder,refund};