const Coupon = require('../model/couponModel');

const couponLoad = async(req,res)=>{
    try{
        const coupon = await Coupon.find().lean();

        const coupons = coupon.map(coupon => {
            const expiryDate = new Date(coupon.expiry);
            const formattedExpiry = expiryDate.toLocaleString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone:'UTC'
            });
            return {
                ...coupon,
                expiry:formattedExpiry/* new Date(coupon.expiry).toLocaleDateString()*/
            };
        });

        res.render('admin/coupons',{title:'Coupons',style:'admin.css',admin:true,coupons});
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal server error'});
    }
}

const addCouponLoad = async(req,res)=>{
    try{
     
        res.render('admin/add-coupons',{title:'Add coupons',style:'admin.css',admin:true,message:req.flash('message'),message1:req.flash('message1')});
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal server error'})
    }
}

const createCoupon = async(req,res)=>{
    try{
    
     const {name,discount,expiry,purchase} = req.body;
        console.log(expiry)
        //const [year,month,day,hours,minutes]=expiry.split(/[-T:]/)
          console.log(purchase)
        const expiryWithOffset = expiry + "+00:00";
        const expiryDate = new Date(expiryWithOffset);
    // const expiryDate = new Date(year,month - 1,day,hours,minutes);
   // const expiryDate =  Date.now(expiry)
//console.log(expiryDate.toISOString())
//const expiryDate = new Date(expiry);
const coupons = await Coupon.find({name:name});
console.log(coupons)
if(coupons.length>0){
 req.flash('message1','Coupon already exist');
 res.redirect('/admin/add-coupon');

}
else{
    console.log(expiryDate);
    const coupon = new Coupon({
       name:name,
       discount:discount,
       expiry:expiryDate.toISOString(),
       purchase_amt:purchase,
       usedBy:[]
    });

    const savedCoupon = await coupon.save();
    if(savedCoupon){
       req.flash('message','Coupon created');
       res.redirect('/admin/add-coupon');
    }
}

    
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal server error'})
    }
}

const loadEditCoupon = async(req,res)=>{
    try{
        const id = req.query.id;
        const coupon = await Coupon.findOne({_id:id}).lean();
        const formattedExpiry = coupon.expiry.toISOString().slice(0, 16);
        res.render('admin/edit-coupons',{title:'editcoupon',admin:true,style:'admin.css',coupon:{...coupon,formattedExpiry},message:req.flash('message')});
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal server error'});
    }
}

const editCoupons = async(req,res)=>{
    try{

        const {id,name,discount,expiry,purchase} = req.body;
        
       /*console.log(name);
       console.log(discount)
       console.log(expiry);
       const [year,month,day,hours,minutes]=expiry.split(/[-T:]/);
       const expiryDate = new Date(year,month - 1,day,hours,minutes);
//const expiryDate = Date.now(expiry);*/
   
const expiryWithOffset = expiry + "+00:00";
const expiryDate = new Date(expiryWithOffset);

  const couponUpdate = await Coupon.findByIdAndUpdate(id,{$set:{name:name,discount:discount,expiry:expiryDate.toISOString(),purchase_amt:purchase}},{new:true})
        console.log(couponUpdate);

        if(couponUpdate){
            req.flash('message','Updated');
            res.redirect(`/admin/edit-coupon?id=${id}`);
        }else{
            req.flash('message','failed');
            res.redirect(`/admin/edit-coupon?id=${id}`);
        }


    }
    catch(err){
   console.log(err.message);
    }
}


const deleteCoupons = async(req,res)=>{
    try{
        const id = req.query.id;
        const coupon = await Coupon.deleteOne({_id:id});
        res.redirect('/admin/coupons');
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports = {couponLoad,createCoupon,addCouponLoad,loadEditCoupon,editCoupons,deleteCoupons};