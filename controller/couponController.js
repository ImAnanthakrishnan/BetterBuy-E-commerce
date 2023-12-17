const Coupon = require('../model/couponModel');
const User = require('../model/userModel');
const Cart = require('../model/cartModel');
const verifyCoupon = async(req,res)=>{
    try{
    const id = req.session.user_id;
    const {coupon,total} = req.body;
    console.log(total)
    const validCoupon = await Coupon.findOne({name:coupon});
    if(validCoupon === null){
       
        const response = {message:'Invalid Coupon'}
       return res.status(400).json(response);
    }

    if(validCoupon.purchase_amt>total ){
        const response = {message:`Minimum purchase amount is ${validCoupon.purchase_amt}`}
        return res.status(400).json(response);
        
    }

    if(validCoupon.usedBy.includes(id)){
       
        const response = {message:'Coupon already used'}
        return res.status(400).json(response);
       }
      
    const currentDate1 = new Date();
    const curDate = currentDate1 + "+00:00";
    const currentDate = new Date(curDate);
    const expiryDate = new Date(validCoupon.expiry);
    console.log(currentDate)
    console.log(expiryDate)
   console.log(currentDate.toISOString())
   console.log(expiryDate.toISOString())
    if (currentDate < expiryDate) {
        // Coupon is still valid
        console.log('Coupon is still valid');
    } else {
       
        const response = {message:'Coupon has expired'}
        return res.status(400).json(response);
    }

    

/*if(currentDate<=expiryDate){
    console.log('coupon is still valid');
}else{
    throw new Error('Coupon has expired');
}*/

    const user = await User.findOne({_id:id});
    let {totalPrice} = await Cart.findOne({
        userId:user._id,
    }).populate('product.productId');
    let totalAfterDiscount = (totalPrice - (totalPrice * validCoupon.discount) / 100).toFixed(2);
   const updated = await Cart.findOneAndUpdate({userId:user._id},{$set:{totalPrice:totalAfterDiscount}},{new:true});
  

   validCoupon.usedBy.push(id);
   await validCoupon.save();

    if(updated){
        res.status(200).json({message:'coupon verified'})
    }else{
        res.status(400).json({error:'Bad request'})
    }
}
    catch(err){
        console.log(err.message);
        const response = {
            error:err.message
        }
        res.status(400).json(response);
    }
}




module.exports = {verifyCoupon};

