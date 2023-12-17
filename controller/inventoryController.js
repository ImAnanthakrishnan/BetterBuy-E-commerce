const mongoose = require('mongoose');
const {Types} = mongoose;
const Product = require('../model/productModel');
//const Cart = require('../model/cartModel');
const loadInventory = async(req,res)=>{
    try{
        const product = await Product.find();
        const productData = await Product.find().populate('category_id').lean();
        const proToUpdate = product.filter(product=>product.quantity <= 0);
        
        if(proToUpdate.length>0){
          const proId = proToUpdate.map(product=>product._id);
          console.log(proId);
          await Product.updateMany({_id:{$in:proId}},{$set:{status:'Unavailable',is_cancelled:true}})
          res.render('admin/inventory',{title:'Inventory',productData,style:'admin.css',admin:true})
        }else{
            res.render('admin/inventory',{title:'Inventory',productData,style:'admin.css',admin:true})
        }
      
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateInventoryLoad = async(req,res)=>{
    try{
        const id = req.query.id;
        const productData = await Product.findById({_id:id}).lean();
     
        res.render('admin/update-inventory',{product:productData,admin:true,style:'admin.css',message:req.flash('message')});
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal Server Error'});
    }
}

const updateInventory = async(req,res)=>{
    try{
       // const id = req.body.id;
       const {id,quantity}=req.body;
      console.log(id)
      console.log(quantity);
       
        if(quantity <= 0){
            const updateStock = await Product.findByIdAndUpdate({_id:id},{$set:{quantity:quantity,status:'Unavailable',is_cancelled:true}},{new:true});
            const response = {
                message:'Stock updated',
                updateStock
               }
                res.status(201).json(response);
        }else{
            const updateStock = await Product.findByIdAndUpdate({_id:id},{$set:{quantity:quantity,status:'Available',is_cancelled:false}},{new:true});
            const response = {
                message:'Stock updated',
                updateStock
               }
                res.status(201).json(response);
        }
        /*if(updateStock){
            console.log(updateStock.quantity);
            updateStock.quantity = req.body.quantity || updateStock.quantity;
        }
        const updatedStock = await updateStock.save();*/
     
       
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal Server Error'});
    }
}



module.exports = {loadInventory,updateInventoryLoad,updateInventory};