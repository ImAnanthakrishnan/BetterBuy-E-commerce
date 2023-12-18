const User = require('../model/userModel');
const Product = require('../model/productModel');
const Order = require('../model/ordersModel');

const bcrypt = require('bcrypt')
const loadLogin = async(req,res)=>{
    try{
        res.render('admin/login',{title:'adminlogin'})
    }
    catch(err){
        console.log(err.message)
    }
}

const verifyLogin = async(req,res)=>{
    try{
       const email = req.body.email;
       const password = req.body.password;
      
       const adminData = await User.findOne({email:email}).lean();
       if(adminData){
   
        const passwordMatch = await bcrypt.compare(password,adminData.password);
        console.log(passwordMatch)
        if(passwordMatch){
            if(adminData.is_admin === 0){
                res.render('admin/login',{title:'login',message:'Username and password is incorrect',err:true})
            }else{
                req.session.admin_id = adminData._id;
                res.redirect('/admin/home');
            }
        }else{
            res.render('admin/login',{title:'login',message:'Invalid credential',err:true})
        }
       }else{
        res.render('admin/login',{title:'login',message:'Check email and password',err:true})
       }
    }
    catch(err){
        console.log(err.message)
    }
}
const loadDashBoard = async(req,res)=>{
    try{
        let log = req.session.admin_id;
        const productCount = await Product.find().count().lean();
        const purchaseCount = await Order.find({status:'Order Placed'}).count().lean();
        const salesCount = await Order.find({status:'Delivered'}).count().lean();
        const inventoryCount = await Product.find({quantity:0}).count().lean();
      
        const adminData = await User.findOne({_id:log});
        res.render('admin/index',{style:'admin.css',admin:true,adminData,productCount,purchaseCount,salesCount,inventoryCount});
    }
    catch(err){
        console.log(err.message)
    }
}

const adminLogout = async(req,res)=>{
    try{
       /* const id = req.query.id;
        console.log(id);
        const store = req.session.store;
        store.destroy(id,(err)=>{
            if(err){
                console.error('Error destroying session:', err);
            }else{
                console.log(`Session with ID ${id} destroyed`);
            }
        })*/
        req.session.admin_id=null;
        res.redirect('/admin');
    }
    catch(err){
        console.log(err.message);
    }
}
module.exports={loadLogin,verifyLogin,loadDashBoard,adminLogout};